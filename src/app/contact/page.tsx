import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import ContactHero from "@/components/sections/contact/contact-hero";
import ContactIntro from "@/components/sections/contact/contact-intro";
import ContactMethods from "@/components/sections/contact/contact-methods";
import FloatingTicketCta from "@/components/conversion/floating-ticket-cta";
import JsonLd from "@/components/seo/json-ld";
import { events } from "@/lib/events";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Contact The Nexus | Partnerships, Events & Community";
const description =
  "Contact The Nexus for event partnerships, collaborations, brand experiences, and premium community programming in Mumbai.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/contact",
  keywords: ["event partnerships Mumbai", "brand experiences Mumbai", "contact The Nexus", "community events Mumbai"],
});

export default function ContactPage() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <>
      <JsonLd
        id="contact-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/contact", title, description, breadcrumbs, type: "ContactPage" }),
        ])}
      />
      <Navbar />
      <main className="relative overflow-hidden">
        <ContactHero />
        <ContactIntro />
        <ContactMethods />
      </main>
      <FloatingTicketCta event={featuredEvent} />
      <FooterEcosystem />
    </>
  );
}
