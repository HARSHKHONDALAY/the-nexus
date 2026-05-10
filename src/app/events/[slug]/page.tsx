import { notFound } from "next/navigation";

import GlobalAtmosphere from "@/components/animations/global-atmosphere";
import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import EventCommunityVibe from "@/components/sections/event-detail/event-community-vibe";
import EventCinematicVideo from "@/components/sections/event-detail/event-cinematic-video";
import EventDescription from "@/components/sections/event-detail/event-description";
import EventFaq from "@/components/sections/event-detail/event-faq";
import EventFlow from "@/components/sections/event-detail/event-flow";
import EventGallery from "@/components/sections/event-detail/event-gallery";
import EventHero from "@/components/sections/event-detail/event-hero";
import EventMetadata from "@/components/sections/event-detail/event-metadata";
import EventPosterFeature from "@/components/sections/event-detail/event-poster-feature";
import EventTicketCta from "@/components/sections/event-detail/event-ticket-cta";
import RegistrationSection from "@/components/sections/event-detail/registration/registration-section";
import RelatedEvents from "@/components/sections/event-detail/related-events";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { getEventBySlug as getEventBySlugFromApi, getUpcomingEvents } from "@/lib/api/events";
import { mapPlatformEventToEventData, mapPlatformEventsToEventData } from "@/lib/api/event-mappers";
import { absoluteUrl, createEventMetadata, createMetadata, eventSeoDescription } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  eventSchema,
  faqSchema,
  imageObjectSchema,
  jsonLdGraph,
  webPageSchema,
  videoObjectSchema,
} from "@/lib/seo/schema";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  
  try {
    const platformEvent = await getEventBySlugFromApi(slug);
    
    if (!platformEvent) {
      return createMetadata({
        title: "Event Not Found | The Nexus",
        description: "The requested Nexus event could not be found.",
        path: "/events",
        noIndex: true,
      });
    }

    const event = mapPlatformEventToEventData(platformEvent);
    return createEventMetadata(event);
  } catch (error) {
    console.error(`Failed to generate metadata for event "${slug}":`, error);
    return createMetadata({
      title: "Event | The Nexus",
      description: "Explore premium events at The Nexus.",
      path: "/events",
      noIndex: true,
    });
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  try {
    const platformEvent = await getEventBySlugFromApi(slug);
    
    if (!platformEvent) {
      notFound();
    }

    const event = mapPlatformEventToEventData(platformEvent);
    
    // Fetch related events
    const upcomingEvents = await getUpcomingEvents();
    const relatedEvents = mapPlatformEventsToEventData(
      upcomingEvents.filter(e => e.slug !== slug).slice(0, 3)
    );

  const breadcrumbs = [
      { name: "Home", path: "/" },
      { name: "Events", path: "/events" },
      { name: event.title, path: `/events/${event.slug}` },
    ];
    const videoSchema = videoObjectSchema(event);

    return (
      <>
        <JsonLd
          id="event-detail-schema"
          data={jsonLdGraph([
            breadcrumbSchema(breadcrumbs),
            webPageSchema({
              path: `/events/${event.slug}`,
              title: `${event.title} | ${event.world} Event in ${event.city}`,
              description: eventSeoDescription(event),
              breadcrumbs,
              primaryEntityId: `${absoluteUrl(`/events/${event.slug}`)}#event`,
            }),
            eventSchema(event),
            faqSchema(event),
            ...imageObjectSchema(event),
            videoSchema,
          ])}
        />
        <Navbar />
        <main className="relative overflow-hidden">
          <GlobalAtmosphere />
          <EventHero event={event} />
          <EventTicketCta event={event} />
          <EventMetadata event={event} />
          <EventDescription event={event} />
          <EventCinematicVideo event={event} />
          <EventPosterFeature event={event} />
          <EventGallery event={event} />
          <EventCommunityVibe event={event} />
          <EventFlow event={event} />
          <RegistrationSection event={event} />
          <EventFaq event={event} />
          <RelatedEvents currentEvent={event} relatedEvents={relatedEvents} />
        </main>
        <FloatingTicketCta event={event} label="Reserve" />
        <FooterEcosystem />
      </>
    );
  } catch (error) {
    console.error(`Failed to load event page "${slug}":`, error);
    notFound();
  }
}
