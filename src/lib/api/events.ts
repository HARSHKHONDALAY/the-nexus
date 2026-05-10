import { cache } from "react";

// API Configuration
function getApiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_BASE_URL must be configured in production");
  }
  return "http://localhost:8080/api";
}

// Enhanced fetch with retry and error handling
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        cache: options.cache ?? "no-store",
        ...options,
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
      if (attempt === maxRetries) {
        console.error(`API request failed after ${maxRetries} attempts:`, error);
        throw error;
      }
      console.warn(`API request attempt ${attempt} failed, retrying...`, error);
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
  
  // This should never be reached due to the loop logic
  throw new Error("API request failed unexpectedly");
}

// Event Types - matching backend DTO structure
export interface TicketTier {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  currency: string;
  capacity: number;
  soldCount: number;
  reservedCount: number;
  salesStartAt?: string;
  salesEndAt?: string;
  active: boolean;
  sortOrder: number;
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
  venueName: string;
  venueAddress?: string;
  city: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  bannerUrl?: string;
  heroMediaUrl?: string;
  capacity: number;
  waitlistEnabled: boolean;
  registrationOpen: boolean;
  allowWalkIns: boolean;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  seoTitle?: string;
  seoDescription?: string;
  venueCostPaise: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  ticketTiers?: TicketTier[];
}

export interface EventWithTicketTiers extends PlatformEvent {
  ticketTiers: TicketTier[];
}

// API Functions with caching
export const getPublicEvents = cache(async function getPublicEvents(): Promise<PlatformEvent[]> {
  try {
    // Only fetch from backend API - no fallbacks
    const backendEvents = await apiFetch<PlatformEvent[]>("/events/public");
    
    // Validate backend response
    if (Array.isArray(backendEvents)) {
      console.log(`✅ Successfully fetched ${backendEvents.length} events from backend`);
      return backendEvents;
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
    if (!event.ticketTiers) {
      const ticketTiers = await apiFetch<TicketTier[]>(`/events/${event.id}/ticket-tiers`);
      event.ticketTiers = ticketTiers;
    }
    
    return event;
  } catch (error) {
    console.error(`Failed to fetch event by slug "${slug}":`, error);
    return null;
  }
});

export const getFeaturedEvents = cache(async function getFeaturedEvents(): Promise<PlatformEvent[]> {
  try {
    const events = await getPublicEvents();
    // For now, return all published events as featured
    // TODO: Add featured flag logic in backend
    return events.filter(event => event.status === "PUBLISHED" || event.status === "LIVE");
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
      .filter(event => new Date(event.startsAt) > now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
});

// Admin API functions (separate from public)
export async function getAdminEvents(actorId: string): Promise<PlatformEvent[]> {
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
