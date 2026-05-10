import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import MomentsExperience from "@/components/sections/moments/moments-experience";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
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

export default function MomentsPage() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

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
      <FooterEcosystem />
    </>
  );
}
