import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import MomentsExperience from "@/components/sections/moments/moments-experience";
import JsonLd from "@/components/seo/json-ld";
import { getPublicEvents } from "@/lib/api/events-safe";
import type { PlatformEvent } from "@/lib/api/events-safe";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Event Moments & Community Gallery | The Nexus";
const description =
  "See cinematic moments from The Nexus culture rooms, chess socials, art workshops, and premium community events.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Moments", path: "/moments" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/moments",
  keywords: ["event gallery Mumbai", "Nexus event moments", "chess event photos", "art workshop gallery"],
});

export default async function MomentsPage() {
  // Fetch live events from backend
  let events: PlatformEvent[] = [];
  try {
    events = await getPublicEvents();
  } catch (error) {
    console.error("Failed to fetch events for moments page:", error);
    // Continue with empty events array if backend fails
  }

  const featuredEvent = events[0]; // Use first event as featured, or undefined if no events

  return (
    <>
      <JsonLd
        id="moments-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/moments", title, description, breadcrumbs, type: "CollectionPage" }),
        ])}
      />
      <Navbar />
      <MomentsExperience featuredEvent={featuredEvent} />
      <FloatingTicketCta event={featuredEvent} />
      <FooterEcosystem featuredEvent={featuredEvent} />
    </>
  );
}
