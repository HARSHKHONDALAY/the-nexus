// Legacy event types - kept for compatibility but should use backend types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "chess-nexus" | "art-nexus";
  startsAt: string;
  endsAt: string;
  venueName: string;
  venueAddress: string;
  city: string;
  featured?: boolean;
  status: "draft" | "published" | "live" | "sold_out" | "closed" | "archived";
  posterImage?: string;
  ticketPrice?: number;
  capacity?: number;
  seoTitle?: string;
  seoDescription?: string;
}

// DEPRECATED: Use getPublicEvents() from lib/api/events instead
// This file is kept for backward compatibility only
export const events: Event[] = [];

// DEPRECATED: Use getEventBySlug() from lib/api/events instead
export function getEventBySlug(slug: string): Event | undefined {
  return events.find(event => event.slug === slug);
}

// DEPRECATED: Use backend filtering instead
export function getEventsByType(type: "chess-nexus" | "art-nexus"): Event[] {
  return events.filter(event => event.type === type);
}

// DEPRECATED: Use getFeaturedEvents() from lib/api/events instead
export function getFeaturedEvent(): Event | undefined {
  return events.find(event => event.featured);
}

// DEPRECATED: Use getUpcomingEvents() from lib/api/events instead
export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.startsAt) > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

// DEPRECATED: Use backend filtering instead
export function getPastEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.startsAt) <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
}
