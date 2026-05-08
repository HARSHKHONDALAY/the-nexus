import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import AboutHero from "@/components/sections/about/about-hero";
import Philosophy from "@/components/sections/about/philosophy";
import Vision from "@/components/sections/about/vision";
import Founders from "@/components/sections/about/founders";
import AboutCultureWorlds from "@/components/sections/about/culture-worlds";
import ClosingManifesto from "@/components/sections/about/closing-manifesto";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <AboutHero />
        <Philosophy />
        <Vision />
        <Founders />
        <AboutCultureWorlds />
        <ClosingManifesto />
      </main>
      <FooterEcosystem />
    </>
  );
}

