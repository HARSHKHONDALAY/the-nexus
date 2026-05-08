import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import CultureWorldsStrip from "@/components/sections/events/culture-worlds-strip";
import EventsDiscover from "@/components/sections/events/events-discover";
import EventsEditorialBlock from "@/components/sections/events/events-editorial-block";
import EventsHero from "@/components/sections/events/events-hero";
import FeaturedEvent from "@/components/sections/events/featured-event";
import { events } from "@/lib/events";

export default function EventsPage() {
  const featuredEvent = events.find((e) => e.featured) ?? events[0];
  const upcomingEvents = events.filter((e) => e.slug !== featuredEvent.slug);

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <EventsHero />
        <FeaturedEvent event={featuredEvent} />
        <EventsDiscover events={upcomingEvents} />
        <CultureWorldsStrip />
        <EventsEditorialBlock />
      </main>
      <FooterEcosystem />
    </>
  );
}
