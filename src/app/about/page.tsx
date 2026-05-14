import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import AboutHero from "@/components/sections/about/about-hero";
import Philosophy from "@/components/sections/about/philosophy";
import Vision from "@/components/sections/about/vision";
import Founders from "@/components/sections/about/founders";
import ClosingManifesto from "@/components/sections/about/closing-manifesto";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, foundersPersonSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "About The Nexus | Premium Culture & Event Ecosystem";
const description =
  "Meet The Nexus, a Mumbai-born event ecosystem designing premium social experiences across chess, art, culture, and community.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/about",
  keywords: ["The Nexus founders", "premium culture ecosystem", "Mumbai event brand", "community architecture"],
});

export default function AboutPage() {
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
        id="about-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/about", title, description, breadcrumbs, type: "AboutPage" }),
          ...foundersPersonSchema(),
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden">
        <AboutHero />
        <Philosophy />
        <Vision />
        <Founders />
        <ClosingManifesto />
      </main>
      <FloatingTicketCta event={eventData} />
      <FooterEcosystem />
    </>
  );
}
