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
    mood: "Warm rivalry after dark",
    dateISO: "2026-05-23T21:00:00+05:30",
    type: "Night",
    featured: true,
    tagline: "A high-voltage chess night for sharp minds, warm rivalry, and Mumbai after dark.",
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
      "A chess night where competition becomes conversation.",
    longDescription:
      "Checkmate Chaos is not a silent tournament hall. It is a hosted chess room with rapid pairings, music-led momentum, and the kind of table energy where a lost game can become a new friendship. Come for the board. Stay because the room starts feeling familiar.",
    gallery: ["Main floor boards", "Sound-led pairing zone", "After-hours social lounge"],
    vibePoints: [
      "Warm rivalry without intimidating tournament energy",
      "Hosted pairings so solo guests are folded into the room",
      "After-game conversations that carry beyond the board",
    ],
    timeline: [
      {
        time: "9:00 PM",
        title: "Arrival and Hosted Entry",
        description: "Check-in, first introductions, and a clear sense of how the room flows.",
      },
      {
        time: "9:45 PM",
        title: "Rapid Pairing Rounds",
        description: "Short-match cycles with live social rotation.",
      },
      {
        time: "11:15 PM",
        title: "Social Interlude",
        description: "A pause for drinks, introductions, and the conversations that start after a close game.",
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
          "No. The format balances social flow with strategic play at mixed levels. You can be sharp without being intense.",
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
    mood: "Cafe-table strategy",
    dateISO: "2026-05-30T21:00:00+05:30",
    type: "Session",
    tagline: "An intimate chess social where the board gives people an easy reason to meet.",
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
      "A conversation-first chess gathering for people who like thoughtful company.",
    longDescription:
      "Chess Social Night is slower, warmer, and more personal. The format is made for cafe-culture chess: hosted introductions, inclusive pairings, and enough breathing room for conversations between rounds. It is designed so coming alone feels natural, not brave.",
    gallery: ["Social chess lounge", "Hosted pairings", "Cafe floor atmosphere"],
    vibePoints: [
      "Conversation-first chess with gentle competitive rhythm",
      "Curated pairings that make solo attendance easy",
      "A premium cafe-room mood with repeat-face familiarity",
    ],
    timeline: [
      {
        time: "9:00 PM",
        title: "Arrival and Introductions",
        description: "Hosted intros, seating support, and first pairings.",
      },
      {
        time: "9:40 PM",
        title: "Round Cycles",
        description: "Slow pairings with social breaks.",
      },
      {
        time: "11:00 PM",
        title: "Social Interlude",
        description: "Open connection block for conversations, rematches, and new tables.",
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
          "Yes. This format is designed around solo comfort, hosted entry, and easy introductions.",
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
    mood: "Soft creative intimacy",
    dateISO: "2026-05-16T18:30:00+05:30",
    type: "Experience",
    tagline: "A guided texture-painting room for expression, conversation, and slow evening calm.",
    date: "Saturday, 16 May 2026",
    time: "6:30 PM - 10:30 PM",
    venue: "Coast & Bloom, Dadar",
    city: "Mumbai",
    capacity: "180 members",
    remainingSpots: 31,
    dressCode: "Contemporary evening",
    agePolicy: "21+",
    priceFrom: "INR 1,199",
    description: "An art room where people loosen up without needing to be artists.",
    longDescription:
      "Texture Painting is a softer Nexus room: guided, tactile, and emotionally open. Guests move through materials, prompts, and small table conversations at a pace that lets the city fall away. You do not need skill. You need curiosity, a little presence, and willingness to make something with people around you.",
    gallery: ["Texture table setup", "Guided painting ritual", "Creative social floor"],
    vibePoints: [
      "Beginner-friendly guidance with a premium table setup",
      "Soft social prompts that make conversation feel natural",
      "A take-home artwork tied to a real evening memory",
    ],
    timeline: [
      { time: "6:30 PM", title: "Arrival Frames", description: "Guest arrival, table settling, and material briefing." },
      { time: "7:15 PM", title: "Guided Texture Session", description: "Host-led creative immersion with beginner-friendly prompts." },
      { time: "8:45 PM", title: "Social Reflection", description: "Conversation, table sharing, and community exchange." },
      { time: "9:30 PM", title: "Open Creative Block", description: "Final personal work, photos, and a soft floor close." },
    ],
    faqs: [
      { question: "Do I need painting experience?", answer: "No. The format is beginner-friendly, guided, and built for people who simply want to express." },
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
