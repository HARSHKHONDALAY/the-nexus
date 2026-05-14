/**
 * Production-ready Events API with SSR safety and graceful fallbacks
 * Replaces the old events.ts file to fix ECONNREFUSED issues
 */

import { cache } from "react";
import { apiClient, safeApiCall, ApiError, NetworkError, TimeoutError } from "./client";
import type { PlatformEvent, TicketTier, CreateBookingRequest, PaymentOrder, Booking } from "../types/api";

export interface EventWithTicketTiers extends PlatformEvent {
  ticket_tiers: TicketTier[];
}

// Fallback data for when API is unavailable
const FALLBACK_EVENTS: PlatformEvent[] = [];

const FALLBACK_EVENT: PlatformEvent = {
  id: "fallback-event",
  category: {
    id: "fallback-category",
    slug: "chess-nexus",
    name: "Chess Nexus",
    description: "Chess events and tournaments",
    active: true,
  },
  slug: "chess-tournament",
  title: "Chess Tournament",
  subtitle: "Competitive Chess Championship",
  description: "Join us for an exciting chess tournament featuring the best players in Mumbai.",
  status: "PUBLISHED",
  venue_name: "Nexus Chess Arena",
  venue_address: "Bandra West, Mumbai",
  city: "Mumbai",
  starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
  timezone: "Asia/Kolkata",
  capacity: 50,
  waitlist_enabled: true,
  registration_open: true,
  allow_walk_ins: true,
  visibility: "PUBLIC",
  venue_cost_paise: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Safe API functions with proper error handling and fallbacks
export const getPublicEvents = cache(async function getPublicEvents(): Promise<PlatformEvent[]> {
  return safeApiCall(
    async () => {
      const events = await apiClient.get<PlatformEvent[]>("/events/public");
      
      // Validate and filter events
      if (!Array.isArray(events)) {
        throw new Error("Invalid events response format");
      }
      
      const validEvents = events.filter(event => {
        if (!event || !event.id || !event.title || !event.status) {
          console.log(`🚫 Filtering out invalid event: missing required fields`);
          return false;
        }
        
        return event.status === "PUBLISHED" || event.status === "LIVE";
      });
      
      console.log(`✅ Successfully fetched ${validEvents.length} valid events`);
      return validEvents;
    },
    FALLBACK_EVENTS,
    "getPublicEvents"
  );
});

export const getEventBySlug = cache(async function getEventBySlug(slug: string): Promise<EventWithTicketTiers | null> {
  if (!slug || typeof slug !== "string") {
    console.warn(`⚠️ Invalid slug provided: ${slug}`);
    return null;
  }
  
  return safeApiCall(
    async () => {
      const event = await apiClient.get<EventWithTicketTiers>(`/events/slug/${slug}`);
      
      // Fetch ticket tiers if not included
      if (!event.ticket_tiers) {
        try {
          const ticketTiers = await apiClient.get<TicketTier[]>(`/events/${event.id}/ticket-tiers`);
          event.ticket_tiers = ticketTiers;
        } catch (tierError) {
          console.warn(`⚠️ Failed to fetch ticket tiers for event ${event.id}:`, tierError);
          event.ticket_tiers = [];
        }
      }
      
      return event;
    },
    null,
    `getEventBySlug(${slug})`
  );
});

export const getFeaturedEvents = cache(async function getFeaturedEvents(): Promise<PlatformEvent[]> {
  return safeApiCall(
    async () => {
      const events = await getPublicEvents();
      // Return all valid published/live events as featured
      return events.slice(0, 6); // Limit to 6 featured events
    },
    FALLBACK_EVENTS,
    "getFeaturedEvents"
  );
});

export const getUpcomingEvents = cache(async function getUpcomingEvents(): Promise<PlatformEvent[]> {
  return safeApiCall(
    async () => {
      const events = await getPublicEvents();
      const now = new Date();
      
      return events
        .filter(event => new Date(event.starts_at) > now)
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        .slice(0, 10); // Limit to 10 upcoming events
    },
    FALLBACK_EVENTS,
    "getUpcomingEvents"
  );
});

// Admin API functions (with proper error handling)
export async function getAdminEvents(actorId: string): Promise<PlatformEvent[]> {
  return safeApiCall(
    async () => {
      const [currentEvents, pastEvents] = await Promise.all([
        apiClient.get<PlatformEvent[]>("/operations/admin/events/current"),
        apiClient.get<PlatformEvent[]>("/operations/admin/events/past")
      ]);
      
      return [...(currentEvents || []), ...(pastEvents || [])];
    },
    [],
    `getAdminEvents(${actorId})`
  );
}

export async function createAdminEvent(eventData: Partial<PlatformEvent>): Promise<PlatformEvent> {
  return safeApiCall(
    async () => {
      // Use FormData for event creation (as per original implementation)
      const formData = new FormData();
      formData.append('eventData', JSON.stringify(eventData));
      
      return await apiClient.postFormData<PlatformEvent>("/operations/admin/events", formData);
    },
    FALLBACK_EVENT,
    "createAdminEvent"
  );
}

// Booking API functions
export async function createBooking(bookingData: CreateBookingRequest): Promise<Booking | null> {
  return safeApiCall(
    async () => {
      return await apiClient.post<Booking>("/bookings", bookingData);
    },
    null,
    "createBooking"
  );
}

export async function createPaymentOrder(bookingId: string): Promise<PaymentOrder | null> {
  return safeApiCall(
    async () => {
      return await apiClient.post<PaymentOrder>("/payments/razorpay/orders", { bookingId });
    },
    null,
    "createPaymentOrder"
  );
}

// Revalidation utilities (safe)
export async function revalidateEventPages(): Promise<void> {
  return safeApiCall(
    async () => {
      await apiClient.post("/api/revalidate/events");
    },
    undefined,
    "revalidateEventPages"
  );
}

export async function revalidateEventPage(slug: string): Promise<void> {
  return safeApiCall(
    async () => {
      await apiClient.post(`/api/revalidate/events/${slug}`);
    },
    undefined,
    `revalidateEventPage(${slug})`
  );
}

// Utility functions
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get("/events/public");
    return true;
  } catch (error) {
    console.warn("API health check failed:", error);
    return false;
  }
}

// Export fallback data for testing
export { FALLBACK_EVENT, FALLBACK_EVENTS };
