export interface EventFaq {
  question: string;
  answer: string;
}

export interface EventTimelineItem {
  time: string;
  title: string;
  description: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  note: string;
  perks: string[];
  status?: "available" | "limited" | "sold_out";
}

export interface EventData {
  slug: string;
  eventKey: string;
  title: string;
  world: "The Chess Nexus" | "The Art Nexus";
  mood: string;
  dateISO: string;
  type: "Salon" | "Session" | "Night" | "Experience";
  featured?: boolean;
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
  timeline: EventTimelineItem[];
  faqs: EventFaq[];
  ticketTiers: TicketTier[];
}

export const events: EventData[] = [
  {
    slug: "checkmate-chaos",
    eventKey: "checkmate-chaos",
    title: "Checkmate Chaos",
    world: "The Chess Nexus",
    mood: "Collective intensity",
    dateISO: "2026-05-23T21:00:00+05:30",
    type: "Night",
    featured: true,
    tagline: "A high-voltage chess night where sound, strategy, and social energy collide.",
    date: "Saturday, 23 May 2026",
    time: "9:00 PM - 1:00 AM",
    venue: "Coast & Bloom, Dadar",
    city: "Mumbai",
    capacity: "220 members",
    remainingSpots: 64,
    dressCode: "Dark minimal",
    agePolicy: "21+",
    priceFrom: "INR 600",
    description:
      "A collective chess experience designed for modern culture energy.",
    longDescription:
      "Checkmate Chaos is built as a cinematic chess night—rapid pairings, hosted rituals, and social momentum designed for people who want strategic play with cultural electricity. It is not a tournament boardroom; it is an immersive room where thought, rhythm, and connection meet.",
    gallery: ["Main floor boards", "Sound-led pairing zone", "After-hours social lounge"],
    vibePoints: [
      "High-energy, curated flow",
      "Hosted pairings and social pacing",
      "Collective room electricity",
    ],
    timeline: [
      {
        time: "9:00 PM",
        title: "Arrival and House Calibration",
        description: "Check-in, sound build, and host-led room briefing.",
      },
      {
        time: "9:45 PM",
        title: "Rapid Pairing Rounds",
        description: "Short-match cycles with live social rotation.",
      },
      {
        time: "11:15 PM",
        title: "Collective Interlude",
        description: "Open floor rhythm and curated community moments.",
      },
      {
        time: "12:20 AM",
        title: "Final Boards",
        description: "Closing rounds with cinematic lighting cues.",
      },
    ],
    faqs: [
      {
        question: "Do I need to be highly competitive?",
        answer:
          "No. The format balances social flow with strategic play at mixed levels.",
      },
      {
        question: "Are boards provided?",
        answer:
          "Yes. All boards and timing formats are provided by hosts.",
      },
    ],
    ticketTiers: [
      {
        id: "entry",
        name: "General Entry",
        price: "INR 600",
        note: "Curated access to the full night.",
        perks: ["All-room access", "Hosted pairings", "Community flow"],
      },
    ],
  },
  {
    slug: "chess-social-night",
    eventKey: "chess-social-night",
    title: "Chess Social Night",
    world: "The Chess Nexus",
    mood: "Warm strategic social",
    dateISO: "2026-05-30T21:00:00+05:30",
    type: "Session",
    tagline: "An intimate chess social night built for conversation and connection.",
    date: "Saturday, 30 May 2026",
    time: "9:00 PM - 12:30 AM",
    venue: "Bustling Brew Cafe, Thane",
    city: "Mumbai",
    capacity: "140 members",
    remainingSpots: 39,
    dressCode: "Smart casual darks",
    agePolicy: "21+",
    priceFrom: "INR 600",
    description:
      "A conversation-first chess gathering for community-led culture.",
    longDescription:
      "Chess Social Night is a curated format for relaxed strategic play and social connection. It emphasizes hosted introductions, inclusive pairings, and slower premium pacing that turns a chess night into a community ritual.",
    gallery: ["Social chess lounge", "Hosted pairings", "Cafe floor atmosphere"],
    vibePoints: [
      "Conversation-first energy",
      "Curated pairing rhythm",
      "Belonging-led hosting",
    ],
    timeline: [
      {
        time: "9:00 PM",
        title: "Arrival and Introductions",
        description: "Hosted intros and floor calibration.",
      },
      {
        time: "9:40 PM",
        title: "Round Cycles",
        description: "Slow pairings with social breaks.",
      },
      {
        time: "11:00 PM",
        title: "Social Interlude",
        description: "Open connection block with host prompts.",
      },
      {
        time: "11:45 PM",
        title: "Closing Boards",
        description: "Final rounds and closing ritual.",
      },
    ],
    faqs: [
      {
        question: "Can I attend solo?",
        answer:
          "Yes. This format is designed to be welcoming for solo attendees.",
      },
    ],
    ticketTiers: [
      {
        id: "entry",
        name: "General Entry",
        price: "INR 600",
        note: "Access across the full social night.",
        perks: ["Hosted entry", "Curated pairing flow", "Community social block"],
      },
    ],
  },
  {
    slug: "texture-painting",
    eventKey: "texture-painting",
    title: "Texture Painting",
    world: "The Art Nexus",
    mood: "Immersive creative calm",
    dateISO: "2026-05-16T18:30:00+05:30",
    type: "Experience",
    tagline: "A guided art ritual built around tactile expression and shared creation.",
    date: "Saturday, 16 May 2026",
    time: "6:30 PM - 10:30 PM",
    venue: "Coast & Bloom, Dadar",
    city: "Mumbai",
    capacity: "180 members",
    remainingSpots: 31,
    dressCode: "Contemporary evening",
    agePolicy: "21+",
    priceFrom: "INR 1,199",
    description: "A premium texture-painting experience with guided storytelling and atmosphere.",
    longDescription:
      "Texture Painting is curated as a cinematic creative room. Guests move through guided prompts, tactile material exploration, and social reflection moments. The format is intentionally calm, premium, and community-first.",
    gallery: ["Texture table setup", "Guided painting ritual", "Creative social floor"],
    vibePoints: ["Slow premium pacing", "Guided creative expression", "Community artistry"],
    timeline: [
      { time: "6:30 PM", title: "Arrival Frames", description: "Guest arrival and material briefing." },
      { time: "7:15 PM", title: "Guided Texture Session", description: "Host-led creative immersion." },
      { time: "8:45 PM", title: "Social Reflection", description: "Conversation and community exchange." },
      { time: "9:30 PM", title: "Open Creative Block", description: "Final personal work and floor close." },
    ],
    faqs: [
      { question: "Do I need painting experience?", answer: "No. The format is beginner-friendly and guided." },
      { question: "Are materials included?", answer: "Yes. All materials are provided on-site." },
    ],
    ticketTiers: [
      {
        id: "solo",
        name: "Solo",
        price: "INR 1,500",
        note: "Single participant access.",
        perks: ["All materials included", "Guided session access", "Community reflection block"],
      },
      {
        id: "couple",
        name: "Couple",
        price: "INR 2,598",
        note: "For two participants.",
        perks: ["Dual setup", "Guided flow support", "Shared display block"],
        status: "limited",
      },
      {
        id: "group",
        name: "Group",
        price: "INR 1,199 / person",
        note: "Group booking for 4+ attendees.",
        perks: ["Group table placement", "Host coordination", "Shared showcase"],
      },
    ],
  },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getEventByKey(eventKey: string) {
  return events.find((event) => event.eventKey === eventKey);
}
