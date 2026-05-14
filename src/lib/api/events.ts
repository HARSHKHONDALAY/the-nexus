import { cache } from "react";
import { getApiBaseUrl } from "@/lib/config/api";

// Enhanced fetch with error handling (no retries for invalid URLs)
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  console.log(`🌐 Server-side API request to: ${url}`);

  // Determine caching strategy based on path and options
  const isAdminPath = path.startsWith('/operations/admin') || path.startsWith('/admin');
  const isPublicPath = path.startsWith('/events/public') || path.startsWith('/events/slug/') || path.startsWith('/events/') && !path.includes('/admin');
  
  // Default caching strategy: public paths use ISR, admin paths stay dynamic
  let fetchOptions = { ...options };
  
  if (!options.cache && !options.next) {
    if (isPublicPath) {
      fetchOptions = { ...fetchOptions, next: { revalidate: 60 } };
    } else if (isAdminPath) {
      fetchOptions = { ...fetchOptions, cache: "no-store" as RequestCache };
    } else {
      fetchOptions = { ...fetchOptions, next: { revalidate: 60 } };
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`API request failed:`, error);
    throw error;
  }
}

// Event Types - matching backend DTO structure
export interface TicketTier {
  id: string;
  name: string;
  description: string;
  price_paise: number;
  currency: string;
  capacity: number;
  sold_count: number;
  reserved_count: number;
  sales_start_at?: string;
  sales_end_at?: string;
  active: boolean;
  sort_order: number;
}

export interface EventCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface PlatformEvent {
  id: string;
  category: EventCategory;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "SOLD_OUT" | "CLOSED" | "CANCELLED" | "ARCHIVED";
  venue_name: string;
  venue_address?: string;
  city: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  banner_url?: string;
  hero_media_url?: string;
  capacity: number;
  waitlist_enabled: boolean;
  registration_open: boolean;
  allow_walk_ins: boolean;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  seo_title?: string;
  seo_description?: string;
  venue_cost_paise: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  ticket_tiers?: TicketTier[];
}

export interface EventWithTicketTiers extends PlatformEvent {
  ticket_tiers: TicketTier[];
}

// API Functions with caching
export const getPublicEvents = cache(async function getPublicEvents(): Promise<PlatformEvent[]> {
  try {
    // Only fetch from backend API - no fallbacks
    const backendEvents = await apiFetch<PlatformEvent[]>("/events/public");
    
    // Validate backend response
    if (Array.isArray(backendEvents)) {
      // Filter only by status - remove all name/slug-based filtering
      const filteredEvents = backendEvents.filter(event => {
        // Only filter invalid backend objects
        if (!event || !event.id || !event.title || !event.status) {
          console.log(`🚫 Filtering out invalid event object: missing required fields`);
          return false;
        }
        
        // Only return valid published/live events
        return event.status === "PUBLISHED" || event.status === "LIVE";
      });
      
      console.log(`✅ Successfully fetched ${filteredEvents.length} valid events from backend`);
      return filteredEvents;
    }
    
    throw new Error("Invalid backend response format");
    
  } catch (error) {
    console.error("❌ Failed to fetch events from backend API:", error instanceof Error ? error.message : error);
    // Return empty array - no fallbacks allowed
    return [];
  }
});

export const getEventBySlug = cache(async function getEventBySlug(slug: string): Promise<EventWithTicketTiers | null> {
  try {
    const event = await apiFetch<EventWithTicketTiers>(`/events/slug/${slug}`);
    
    // Fetch ticket tiers separately if not included
    if (!event.ticket_tiers) {
      const ticketTiers = await apiFetch<TicketTier[]>(`/events/${event.id}/ticket-tiers`);
      event.ticket_tiers = ticketTiers;
    }
    
    return event;
  } catch (error) {
    console.error(`Failed to fetch event by slug "${slug}":`, error);
    return null;
  }
});

export const getFeaturedEvents = cache(async function getFeaturedEvents(): Promise<PlatformEvent[]> {
  try {
    // getPublicEvents already filters out fake/demo events
    const events = await getPublicEvents();
    // Return all valid published/live events as featured
    return events;
  } catch (error) {
    console.error("Failed to fetch featured events:", error);
    return [];
  }
});

export const getUpcomingEvents = cache(async function getUpcomingEvents(): Promise<PlatformEvent[]> {
  try {
    const events = await getPublicEvents();
    const now = new Date();
    return events
      .filter(event => new Date(event.starts_at) > now)
      .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
});

// Admin API functions (separate from public)
export async function getAdminEvents(): Promise<PlatformEvent[]> {
  try {
    // Use the correct admin operations endpoint
    const currentEvents = await apiFetch<PlatformEvent[]>("/operations/admin/events/current");
    const pastEvents = await apiFetch<PlatformEvent[]>("/operations/admin/events/past");
    return [...currentEvents, ...pastEvents];
  } catch (error) {
    console.error("Failed to fetch admin events:", error);
    return [];
  }
}

export async function createAdminEvent(eventData: Partial<PlatformEvent>): Promise<PlatformEvent> {
  try {
    // Use the correct admin operations endpoint with FormData
    const formData = new FormData();
    formData.append('eventData', JSON.stringify(eventData));
    
    return await apiFetch<PlatformEvent>("/operations/admin/events", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Failed to create admin event:", error);
    throw error;
  }
}

// Revalidation utilities
export async function revalidateEventPages() {
  try {
    await fetch("/api/revalidate/events", { method: "POST" });
  } catch (error) {
    console.error("Failed to revalidate event pages:", error);
  }
}

export async function revalidateEventPage(slug: string) {
  try {
    await fetch(`/api/revalidate/events/${slug}`, { method: "POST" });
  } catch (error) {
    console.error(`Failed to revalidate event page "${slug}":`, error);
  }
}
