// Event data structure for static events and moments
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

// Static events data for moments page and SEO
export const events: Event[] = [
  {
    id: "chess-nexus-1",
    title: "The Chess Nexus",
    slug: "chess-nexus",
    description: "An immersive chess experience combining strategy, community, and intellectual competition in a premium social setting.",
    type: "chess-nexus",
    startsAt: "2026-06-15T19:00:00Z",
    endsAt: "2026-06-15T23:00:00Z",
    venueName: "The Nexus Club",
    venueAddress: "Bandra West, Mumbai",
    city: "Mumbai",
    featured: true,
    status: "published",
    ticketPrice: 1500,
    capacity: 50,
    seoTitle: "The Chess Nexus - Premium Chess Events in Mumbai",
    seoDescription: "Join The Chess Nexus for intellectually stimulating chess tournaments and social events in Mumbai's premium cultural venue."
  },
  {
    id: "art-nexus-1",
    title: "The Art Nexus",
    slug: "art-nexus",
    description: "A creative exploration of artistic expression through workshops, exhibitions, and collaborative art experiences.",
    type: "art-nexus",
    startsAt: "2026-06-22T16:00:00Z",
    endsAt: "2026-06-22T20:00:00Z",
    venueName: "The Nexus Gallery",
    venueAddress: "Colaba, Mumbai",
    city: "Mumbai",
    featured: false,
    status: "published",
    ticketPrice: 2000,
    capacity: 30,
    seoTitle: "The Art Nexus - Creative Workshops in Mumbai",
    seoDescription: "Explore your creativity at The Art Nexus workshops, exhibitions, and collaborative art experiences in Mumbai."
  }
];

// Helper functions
export function getEventBySlug(slug: string): Event | undefined {
  return events.find(event => event.slug === slug);
}

export function getEventsByType(type: "chess-nexus" | "art-nexus"): Event[] {
  return events.filter(event => event.type === type);
}

export function getFeaturedEvent(): Event | undefined {
  return events.find(event => event.featured);
}

export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.startsAt) > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function getPastEvents(): Event[] {
  const now = new Date();
  return events
    .filter(event => new Date(event.startsAt) <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
}
