import GlobalAtmosphere from "@/components/animations/global-atmosphere";
import Navbar from "@/components/layout/navbar";
import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Hero from "@/components/sections/hero";
import CommunityEnergy from "@/components/sections/community-energy";
import CommunityMemory from "@/components/sections/community-memory";
import EditorialShowcase from "@/components/sections/editorial-showcase";
import FeaturedExperiences from "@/components/sections/featured-experiences";
import PhilosophyBelonging from "@/components/sections/philosophy-belonging";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, eventItemListSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "The Nexus | Premium Events, Chess Socials & Art Workshops in Mumbai";
const description =
  "Discover The Nexus, a cinematic Mumbai event ecosystem for chess socials, art workshops, networking nights, and premium community experiences.";
const breadcrumbs = [{ name: "Home", path: "/" }];

export const metadata = createMetadata({
  title,
  description,
  path: "/",
  keywords: ["Mumbai event platform", "premium social events", "chess socials", "art workshops"],
});

export default function HomePage() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <>
      <JsonLd
        id="home-seo-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/", title, description, breadcrumbs }),
          eventItemListSchema(),
        ])}
      />
      <Navbar />

      <main className="relative z-10 overflow-hidden">
        <GlobalAtmosphere />
        <Hero />
        <FeaturedExperiences />
        <PhilosophyBelonging />
        <CommunityEnergy />
        <CommunityMemory />
        <EditorialShowcase />
      </main>
      <FloatingTicketCta event={featuredEvent} />
      <FooterEcosystem />
    </>
  );
}
