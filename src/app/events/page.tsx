import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import CultureWorldsStrip from "@/components/sections/events/culture-worlds-strip";
import EventsDiscover from "@/components/sections/events/events-discover";
import EventsEditorialBlock from "@/components/sections/events/events-editorial-block";
import EventsHero from "@/components/sections/events/events-hero";
import FeaturedEvent from "@/components/sections/events/featured-event";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, eventItemListSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Upcoming Premium Events in Mumbai | The Nexus";
const description =
  "Explore upcoming Nexus events across chess nights, art workshops, networking experiences, and curated social rooms in Mumbai.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/events",
  keywords: ["upcoming events Mumbai", "chess events Mumbai", "art workshops Mumbai", "networking events Mumbai"],
});

export default function EventsPage() {
  const featuredEvent = events.find((e) => e.featured) ?? events[0];
  const upcomingEvents = events.filter((e) => e.slug !== featuredEvent.slug);

  return (
    <>
      <JsonLd
        id="events-list-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/events", title, description, breadcrumbs, type: "CollectionPage" }),
          eventItemListSchema(),
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden">
        <EventsHero />
        <FeaturedEvent event={featuredEvent} />
        <EventsDiscover events={upcomingEvents} />
        <CultureWorldsStrip />
        <EventsEditorialBlock />
      </main>
      <FloatingTicketCta event={featuredEvent} />
      <FooterEcosystem />
    </>
  );
}
