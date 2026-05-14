import { notFound } from "next/navigation";

import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import RegisterForm from "@/components/sections/register/register-form";
import RegisterHero from "@/components/sections/register/register-hero";
import { getEventBySlug as getEventBySlugFromApi } from "@/lib/api/events-safe";
import { mapPlatformEventToEventData } from "@/lib/api/event-mappers";
import { createMetadata } from "@/lib/seo/metadata";

interface RegisterPageProps {
  params: Promise<{ "event-key": string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: RegisterPageProps) {
  const eventKey = (await params)["event-key"];
  
  try {
    // For now, treat event-key as slug since we don't have eventKey in backend
    const platformEvent = await getEventBySlugFromApi(eventKey);
    
    if (!platformEvent) {
      return createMetadata({
        title: "Register | The Nexus",
        description: "Reserve tickets for The Nexus experiences.",
        path: "/events",
        noIndex: true,
      });
    }

    const event = mapPlatformEventToEventData(platformEvent);
    
    return createMetadata({
      title: `Register for ${event.title} | The Nexus`,
      description: `Reserve tickets for ${event.title}, a ${event.world} experience at ${event.venue}.`,
      path: `/events/${event.slug}`,
      noIndex: true,
      follow: true,
    });
  } catch (error) {
    console.error(`Failed to generate metadata for registration page "${eventKey}":`, error);
    return createMetadata({
      title: "Register | The Nexus",
      description: "Reserve tickets for The Nexus experiences.",
      path: "/events",
      noIndex: true,
    });
  }
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const eventKey = (await params)["event-key"];
  
  // Data fetching - this can be wrapped in try/catch
  let platformEvent;

  try {
    // For now, treat event-key as slug since we don't have eventKey in backend
    platformEvent = await getEventBySlugFromApi(eventKey);
  } catch (error) {
    console.error(`Failed to load registration page for "${eventKey}":`, error);
    notFound();
  }

  // Data validation - separate from JSX rendering
  if (!platformEvent) {
    notFound();
  }

  const event = mapPlatformEventToEventData(platformEvent);

  // JSX rendering - no try/catch wrapper
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <RegisterHero event={event} />
        <RegisterForm event={event} />
      </main>
      <FooterEcosystem featuredEvent={event} />
    </>
  );
}
