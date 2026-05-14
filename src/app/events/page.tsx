import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import CultureWorldsStrip from "@/components/sections/events/culture-worlds-strip";
import EventsDiscover from "@/components/sections/events/events-discover";
import EventsEditorialBlock from "@/components/sections/events/events-editorial-block";
import EventsHero from "@/components/sections/events/events-hero";
import FeaturedEvent from "@/components/sections/events/featured-event";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";

import {
  getFeaturedEvents,
  getUpcomingEvents,
} from "@/lib/api/events-safe";
import type { PlatformEvent } from "@/lib/types/api";

import {
  mapPlatformEventsToEventData,
} from "@/lib/api/event-mappers";
import type { EventData } from "@/lib/api/event-mappers";

import {
  createMetadata,
} from "@/lib/seo/metadata";

import {
  breadcrumbSchema,
  eventItemListSchema,
  jsonLdGraph,
  webPageSchema,
} from "@/lib/seo/schema";

export const dynamic = "force-dynamic";

const title =
  "Upcoming Premium Events in Mumbai | The Nexus";

const description =
  "Explore upcoming Nexus events across chess nights, art workshops, networking experiences, and curated social rooms in Mumbai.";

const breadcrumbs = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Events",
    path: "/events",
  },
];

export const metadata =
  createMetadata({
    title,
    description,
    path: "/events",
    keywords: [
      "upcoming events Mumbai",
      "chess events Mumbai",
      "art workshops Mumbai",
      "networking events Mumbai",
    ],
  });

export default async function EventsPage() {
  let featuredEvents: PlatformEvent[] = [];
  let upcomingEvents: PlatformEvent[] = [];

  try {
    const results =
      await Promise.allSettled([
        getFeaturedEvents(),
        getUpcomingEvents(),
      ]);

    featuredEvents =
      results[0].status ===
      "fulfilled"
        ? results[0].value
        : [];

    upcomingEvents =
      results[1].status ===
      "fulfilled"
        ? results[1].value
        : [];

    if (
      results[0].status ===
      "rejected"
    ) {
      console.error(
        "Featured events API failed:",
        results[0].reason
      );
    }

    if (
      results[1].status ===
      "rejected"
    ) {
      console.error(
        "Upcoming events API failed:",
        results[1].reason
      );
    }
  } catch (error) {
    console.error(
      "Critical error fetching events:",
      error
    );

    featuredEvents = [];
    upcomingEvents = [];
  }

  let mappedFeaturedEvents: EventData[] =
    [];

  let mappedUpcomingEvents: EventData[] =
    [];

  try {
    mappedFeaturedEvents =
      mapPlatformEventsToEventData(
        featuredEvents
      );

    mappedUpcomingEvents =
      mapPlatformEventsToEventData(
        upcomingEvents
      );

    mappedFeaturedEvents =
      mappedFeaturedEvents.filter(
        (event: EventData) =>
          event &&
          event.slug &&
          event.title &&
          event.world
      );

    mappedUpcomingEvents =
      mappedUpcomingEvents.filter(
        (event: EventData) =>
          event &&
          event.slug &&
          event.title &&
          event.world
      );
  } catch (error) {
    console.error(
      "Error mapping events:",
      error
    );

    mappedFeaturedEvents = [];
    mappedUpcomingEvents = [];
  }

  const featuredEvent =
    mappedFeaturedEvents[0] || null;

  const filteredUpcomingEvents =
    mappedUpcomingEvents.filter(
      (event: EventData) =>
        event?.slug &&
        (!featuredEvent ||
          event.slug !==
            featuredEvent.slug)
    );

  const hasAnyEvents =
    mappedFeaturedEvents.length >
      0 ||
    mappedUpcomingEvents.length >
      0;

  return (
    <>
      <JsonLd
        id="events-list-schema"
        data={jsonLdGraph([
          breadcrumbSchema(
            breadcrumbs
          ),

          webPageSchema({
            path: "/events",
            title,
            description,
            breadcrumbs,
            type: "CollectionPage",
          }),

          eventItemListSchema(),
        ])}
      />

      <Navbar />

      <main className="relative overflow-hidden">
        <EventsHero featuredEvent={featuredEvent} />

        {featuredEvent && (
          <FeaturedEvent
            event={featuredEvent}
          />
        )}

        {!hasAnyEvents && (
          <div className="container-custom py-20">
            <div className="rounded-[2rem] border border-lime-200/18 bg-lime-200/[0.04] p-12 text-center">
              <h2 className="mb-4 text-2xl font-medium text-lime-50">
                No Events Available
              </h2>

              <p className="mx-auto max-w-md text-lime-100/60">
                We&apos;re currently
                curating our next set
                of premium experiences.
                Check back soon for
                upcoming chess events,
                art workshops, and
                social gatherings.
              </p>
            </div>
          </div>
        )}

        {hasAnyEvents && (
          <EventsDiscover
            events={
              filteredUpcomingEvents
            }
          />
        )}

        <CultureWorldsStrip />

        <EventsEditorialBlock />
      </main>

      {featuredEvent && (
        <FloatingTicketCta
          event={featuredEvent}
        />
      )}

      <FooterEcosystem featuredEvent={featuredEvent} />
    </>
  );
}