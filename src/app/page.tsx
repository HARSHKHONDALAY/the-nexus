import GlobalAtmosphere from "@/components/animations/global-atmosphere";
import Navbar from "@/components/layout/navbar";
import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Hero from "@/components/sections/hero";
import CommunityEnergy from "@/components/sections/community-energy";
import CommunityMemory from "@/components/sections/community-memory";
import EditorialShowcase from "@/components/sections/editorial-showcase";
import FeaturedExperiences from "@/components/sections/featured-experiences";
import PhilosophyBelonging from "@/components/sections/philosophy-belonging";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { getFeaturedEvents } from "@/lib/api/events-safe";
import { mapPlatformEventsToEventData } from "@/lib/api/event-mappers";
import type { PlatformEvent } from "@/lib/types/api";
import type { EventData } from "@/lib/api/event-mappers";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, eventItemListSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

export const revalidate = 60; // Revalidate homepage every 60 seconds

const title = "The Nexus | Premium Events, Chess Socials & Art Workshops in Mumbai";
const description =
  "Discover The Nexus, a cinematic Mumbai event ecosystem for chess socials, art workshops, networking nights, and premium community experiences.";
const breadcrumbs = [{ name: "Home", path: "/" }];

export const metadata = createMetadata({
  title,
  description,
  path: "/",
  keywords: ["Mumbai event platform", "premium social events", "chess socials", "art workshops"],
});

export default async function HomePage() {
  // Fetch featured events from backend API with safe error handling
  let featuredEvents: PlatformEvent[] = [];
  let mappedEvents: EventData[] = [];
  let featuredEvent: EventData | null = null;
  
  try {
    featuredEvents = await getFeaturedEvents();
    mappedEvents = mapPlatformEventsToEventData(featuredEvents);
    featuredEvent = mappedEvents[0] || null;
  } catch (error) {
    console.error('Failed to fetch featured events for homepage:', error);
    // Set safe defaults to prevent homepage crash
    featuredEvents = [];
    mappedEvents = [];
    featuredEvent = null;
  }

  return (
    <>
      <JsonLd
        id="home-seo-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/", title, description, breadcrumbs }),
          eventItemListSchema(),
        ])}
      />
      <Navbar />

      <main className="relative z-10 overflow-hidden">
        <GlobalAtmosphere />
        <Hero featuredEvent={featuredEvent} />
        <FeaturedExperiences />
        <PhilosophyBelonging />
        <CommunityEnergy />
        <CommunityMemory />
        <EditorialShowcase />
      </main>
      {featuredEvent && featuredEvent.slug && <FloatingTicketCta event={featuredEvent} />}
      <FooterEcosystem featuredEvent={featuredEvent} />
    </>
  );
}
