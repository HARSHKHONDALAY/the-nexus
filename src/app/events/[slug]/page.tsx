import { notFound } from "next/navigation";

import GlobalAtmosphere from "@/components/animations/global-atmosphere";
import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import EventCommunityVibe from "@/components/sections/event-detail/event-community-vibe";
import EventDescription from "@/components/sections/event-detail/event-description";
import EventFaq from "@/components/sections/event-detail/event-faq";
import EventFlow from "@/components/sections/event-detail/event-flow";
import EventGallery from "@/components/sections/event-detail/event-gallery";
import EventHero from "@/components/sections/event-detail/event-hero";
import EventMetadata from "@/components/sections/event-detail/event-metadata";
import RegistrationSection from "@/components/sections/event-detail/registration/registration-section";
import RelatedEvents from "@/components/sections/event-detail/related-events";
import { events, getEventBySlug } from "@/lib/events";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) notFound();

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <GlobalAtmosphere />
        <EventHero event={event} />
        <EventMetadata event={event} />
        <EventDescription event={event} />
        <EventGallery event={event} />
        <EventCommunityVibe event={event} />
        <EventFlow event={event} />
        <RegistrationSection event={event} />
        <EventFaq event={event} />
        <RelatedEvents currentEvent={event} />
      </main>
      <FooterEcosystem />
    </>
  );
}
