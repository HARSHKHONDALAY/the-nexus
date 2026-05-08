import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import ContactHero from "@/components/sections/contact/contact-hero";
import ContactIntro from "@/components/sections/contact/contact-intro";
import ContactFormSection from "@/components/sections/contact/contact-form-section";
import ContactMethods from "@/components/sections/contact/contact-methods";
import WorldsCtaStrip from "@/components/sections/contact/worlds-cta-strip";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <ContactHero />
        <ContactIntro />
        <ContactFormSection />
        <ContactMethods />
        <WorldsCtaStrip />
      </main>
      <FooterEcosystem />
    </>
  );
}

