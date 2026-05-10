import { notFound } from "next/navigation";

import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import RegisterForm from "@/components/sections/register/register-form";
import RegisterHero from "@/components/sections/register/register-hero";
import { events, getEventByKey } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";

interface RegisterPageProps {
  params: Promise<{ "event-key": string }>;
}

export function generateStaticParams() {
  return events.map((event) => ({ "event-key": event.eventKey }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: RegisterPageProps) {
  const eventKey = (await params)["event-key"];
  const event = getEventByKey(eventKey);

  return createMetadata({
    title: event ? `Register for ${event.title} | The Nexus` : "Register | The Nexus",
    description: event
      ? `Reserve tickets for ${event.title}, a ${event.world} experience at ${event.venue}.`
      : "Reserve tickets for The Nexus experiences.",
    path: event ? `/events/${event.slug}` : "/events",
    noIndex: true,
    follow: true,
  });
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const eventKey = (await params)["event-key"];
  const event = getEventByKey(eventKey);

  if (!event) notFound();

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <RegisterHero event={event} />
        <RegisterForm event={event} />
      </main>
      <FooterEcosystem />
    </>
  );
}
