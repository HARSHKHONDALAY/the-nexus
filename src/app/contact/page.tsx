import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import ContactHero from "@/components/sections/contact/contact-hero";
import ContactIntro from "@/components/sections/contact/contact-intro";
import ContactMethods from "@/components/sections/contact/contact-methods";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Contact The Nexus | Partnerships, Events & Community";
const description =
  "Contact The Nexus for event partnerships, collaborations, brand experiences, and premium community programming in Mumbai.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/contact",
  keywords: ["event partnerships Mumbai", "brand experiences Mumbai", "contact The Nexus", "community events Mumbai"],
});

export default function ContactPage() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];
  
  // Convert legacy Event to EventData for FloatingTicketCta compatibility
  const eventData = featuredEvent ? {
    slug: featuredEvent.slug,
    eventKey: featuredEvent.id,
    title: featuredEvent.title,
    world: featuredEvent.type === "chess-nexus" ? "The Chess Nexus" : "The Art Nexus",
    mood: featuredEvent.type === "chess-nexus" ? "strategic" : "creative",
    dateISO: featuredEvent.startsAt,
    type: featuredEvent.type,
    featured: featuredEvent.featured || false,
    tagline: featuredEvent.description,
    date: new Date(featuredEvent.startsAt).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: new Date(featuredEvent.startsAt).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    venue: featuredEvent.venueName,
    city: featuredEvent.city,
    capacity: (featuredEvent.capacity || 50).toString(),
    remainingSpots: featuredEvent.capacity || 50,
    dressCode: "Smart Casual",
    agePolicy: "18+",
    priceFrom: featuredEvent.ticketPrice ? `₹${featuredEvent.ticketPrice}` : "Free",
    description: featuredEvent.description,
    longDescription: featuredEvent.description,
    gallery: [],
    vibePoints: [],
    timeline: [],
    faqs: [],
    community: [],
    ticketTiers: featuredEvent.ticketPrice ? [{
      id: 'default',
      name: 'General Admission',
      price: featuredEvent.ticketPrice.toString(),
      status: 'available' as const,
      note: '',
      perks: []
    }] : [],
    registration: {
      open: featuredEvent.status === 'published' || featuredEvent.status === 'live',
      closesAt: featuredEvent.endsAt
    }
  } : null;

  return (
    <>
      <JsonLd
        id="contact-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/contact", title, description, breadcrumbs, type: "ContactPage" }),
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden">
        <ContactHero />
        <ContactIntro />
        <ContactMethods />
      </main>
      <FloatingTicketCta event={eventData} />
      <FooterEcosystem />
    </>
  );
}
