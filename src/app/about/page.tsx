import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import AboutHero from "@/components/sections/about/about-hero";
import Philosophy from "@/components/sections/about/philosophy";
import Vision from "@/components/sections/about/vision";
import Founders from "@/components/sections/about/founders";
import ClosingManifesto from "@/components/sections/about/closing-manifesto";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, foundersPersonSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "About The Nexus | Premium Culture & Event Ecosystem";
const description =
  "Meet The Nexus, a Mumbai-born event ecosystem designing premium social experiences across chess, art, culture, and community.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/about",
  keywords: ["The Nexus founders", "premium culture ecosystem", "Mumbai event brand", "community architecture"],
});

export default function AboutPage() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <>
      <JsonLd
        id="about-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/about", title, description, breadcrumbs, type: "AboutPage" }),
          ...foundersPersonSchema(),
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden">
        <AboutHero />
        <Philosophy />
        <Vision />
        <Founders />
        <ClosingManifesto />
      </main>
      <FloatingTicketCta event={featuredEvent} />
      <FooterEcosystem />
    </>
  );
}
