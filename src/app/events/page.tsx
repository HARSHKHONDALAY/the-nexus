import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import CultureWorldsStrip from "@/components/sections/events/culture-worlds-strip";
import EventsDiscover from "@/components/sections/events/events-discover";
import EventsEditorialBlock from "@/components/sections/events/events-editorial-block";
import EventsHero from "@/components/sections/events/events-hero";
import FeaturedEvent from "@/components/sections/events/featured-event";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { getFeaturedEvents, getUpcomingEvents } from "@/lib/api/events";
import { mapPlatformEventsToEventData } from "@/lib/api/event-mappers";
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

export default async function EventsPage() {
  // Fetch events from backend API with safe error handling
  let featuredEvents: any[] = [];
  let upcomingEvents: any[] = [];
  
  try {
    const results = await Promise.allSettled([
      getFeaturedEvents(),
      getUpcomingEvents(),
    ]);
    
    featuredEvents = results[0].status === 'fulfilled' ? results[0].value : [];
    upcomingEvents = results[1].status === 'fulfilled' ? results[1].value : [];
    
    // Log any API failures for debugging
    if (results[0].status === 'rejected') {
      console.error('Featured events API failed:', results[0].reason);
    }
    if (results[1].status === 'rejected') {
      console.error('Upcoming events API failed:', results[1].reason);
    }
  } catch (error) {
    console.error('Critical error fetching events:', error);
    // Ensure we have empty arrays to prevent crashes
    featuredEvents = [];
    upcomingEvents = [];
  }

  // Map to frontend EventData format with safe handling
  let mappedFeaturedEvents: any[] = [];
  let mappedUpcomingEvents: any[] = [];
  
  try {
    mappedFeaturedEvents = mapPlatformEventsToEventData(featuredEvents);
    mappedUpcomingEvents = mapPlatformEventsToEventData(upcomingEvents);
    
    // Validate mapped events and filter out invalid ones
    mappedFeaturedEvents = mappedFeaturedEvents.filter(event => 
      event && 
      event.slug && 
      event.title && 
      event.world
    );
    
    mappedUpcomingEvents = mappedUpcomingEvents.filter(event => 
      event && 
      event.slug && 
      event.title && 
      event.world
    );
    
  } catch (error) {
    console.error('Error mapping events:', error);
    mappedFeaturedEvents = [];
    mappedUpcomingEvents = [];
  }

  // Get the first featured event as the main featured event
  const featuredEvent = mappedFeaturedEvents[0] || null;
  
  // Filter out the featured event from upcoming events with safe filtering
  const filteredUpcomingEvents = mappedUpcomingEvents.filter(
    (event) => featuredEvent && event?.slug && event?.slug !== featuredEvent.slug
  );

  // Handle empty state
  const hasAnyEvents = mappedFeaturedEvents.length > 0 || mappedUpcomingEvents.length > 0;

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
        {featuredEvent && <FeaturedEvent event={featuredEvent} />}
        
        {!hasAnyEvents && (
          <div className="container-custom py-20">
            <div className="rounded-[2rem] border border-lime-200/18 bg-lime-200/[0.04] p-12 text-center">
              <h2 className="text-2xl font-medium text-lime-50 mb-4">No Events Available</h2>
              <p className="text-lime-100/60 max-w-md mx-auto">
                We're currently curating our next set of premium experiences. Check back soon for upcoming chess events, art workshops, and social gatherings.
              </p>
            </div>
          </div>
        )}
        
        {hasAnyEvents && <EventsDiscover events={filteredUpcomingEvents} />}
        <CultureWorldsStrip />
        <EventsEditorialBlock />
      </main>
      {featuredEvent && <FloatingTicketCta event={featuredEvent} />}
      <FooterEcosystem />
    </>
  );
}
