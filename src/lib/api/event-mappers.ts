import type { PlatformEvent, TicketTier as ApiTicketTier } from "./events";

// Define EventData and TicketTier interfaces locally since @/lib/events was deleted
export interface EventData {
  slug: string;
  eventKey: string;
  title: string;
  world: string;
  mood: string;
  dateISO: string;
  type: string;
  featured: boolean;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: string;
  remainingSpots: number;
  dressCode: string;
  agePolicy: string;
  priceFrom: string;
  description: string;
  longDescription: string;
  gallery: string[];
  vibePoints: string[];
  timeline: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ticketTiers: TicketTier[];
  posterImageUrl?: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: string;
  note: string;
  perks: string[];
  status: "available" | "limited" | "sold_out";
}

// Map backend PlatformEvent to frontend EventData interface
export function mapPlatformEventToEventData(event: PlatformEvent): EventData {
  // Convert ticket tiers
  const ticketTiers: TicketTier[] = event.ticket_tiers?.map(mapApiTicketTier) || [
    {
      id: "general",
      name: "General Entry",
      price: `INR ${Math.round((event.ticket_tiers?.[0]?.price_paise || 60000) / 100)}`,
      note: "Standard access to the event",
      perks: ["All-room access", "Community flow"],
      status: "available" as const,
    },
  ];

  // Determine event type based on category or other properties
  const eventType = event.category?.slug === "chess-nexus" ? "The Chess Nexus" : 
                   event.category?.slug === "art-nexus" ? "The Art Nexus" : 
                   event.category?.name || "The Nexus";

  // Determine event type classification
  const eventClassification = eventType.includes("Chess") ? "Night" : 
                           eventType.includes("Art") ? "Experience" : 
                           "Session";

  function safeFormatDate(dateString: string, format: 'date' | 'time'): string {
    const date = new Date(dateString);
    if (!isFinite(date.getTime())) {
      return format === 'date' ? 'Invalid Date' : 'Invalid Time';
    }
    
    if (format === 'date') {
      return date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric", 
        month: "long",
        day: "numeric"
      });
    } else {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }

  return {
    slug: event.slug,
    eventKey: event.slug, // Use slug as eventKey for now
    title: event.title,
    world: eventType as "The Chess Nexus" | "The Art Nexus",
    mood: event.subtitle || "Premium curated experience",
    dateISO: event.starts_at,
    type: eventClassification as "Salon" | "Session" | "Night" | "Experience",
    featured: event.status === "PUBLISHED" || event.status === "LIVE", // Use status to determine featured
    tagline: event.subtitle || event.description.substring(0, 100) + "...",
    date: safeFormatDate(event.starts_at, 'date'),
    time: `${safeFormatDate(event.starts_at, 'time')} - ${safeFormatDate(event.ends_at, 'time')}`,
    venue: event.venue_name,
    city: event.city,
    capacity: `${event.capacity} members`,
    remainingSpots: Math.max(0, event.capacity - (event.ticket_tiers?.[0]?.sold_count || 0)),
    dressCode: "Smart casual",
    agePolicy: "21+",
    priceFrom: `INR ${Math.round((event.ticket_tiers?.[0]?.price_paise || 60000) / 100)}`,
    description: event.description.substring(0, 150) + "...",
    longDescription: event.description,
    gallery: ["Event gallery", "Venue photos", "Community moments"], // Placeholder
    vibePoints: [
      "Premium curated experience",
      "Professional hosting",
      "Community focused"
    ],
    timeline: [
      {
        time: safeFormatDate(event.starts_at, 'time'),
        title: "Arrival & Check-in",
        description: "Welcome and registration"
      },
      {
        time: safeFormatDate(event.starts_at, 'time'),
        title: "Main Event",
        description: "Primary event activities"
      }
    ],
    faqs: [
      {
        question: "What should I expect?",
        answer: "A premium curated experience with professional hosting."
      },
      {
        question: "Is this suitable for solo attendees?",
        answer: "Yes, our events are designed to be welcoming to everyone."
      }
    ],
    ticketTiers,
    posterImageUrl: event.banner_url,
  };
}

// Map API ticket tier to frontend ticket tier
function mapApiTicketTier(tier: ApiTicketTier): TicketTier {
  return {
    id: tier.id,
    name: tier.name,
    price: `INR ${Math.round(tier.price_paise / 100)}`,
    note: tier.description || "Standard access",
    perks: ["All-room access", "Community flow"],
    status: tier.sold_count >= tier.capacity ? "sold_out" as const : 
            tier.sold_count > tier.capacity * 0.8 ? "limited" as const : 
            "available" as const,
  };
}

// Map multiple events
export function mapPlatformEventsToEventData(events: PlatformEvent[]): EventData[] {
  return events.map(mapPlatformEventToEventData);
}
