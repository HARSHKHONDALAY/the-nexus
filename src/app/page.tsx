import GlobalAtmosphere from "@/components/animations/global-atmosphere";
import Navbar from "@/components/layout/navbar";
import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Hero from "@/components/sections/hero";
import CommunityEnergy from "@/components/sections/community-energy";
import EditorialShowcase from "@/components/sections/editorial-showcase";
import ExploreWorlds from "@/components/sections/explore-worlds";
import FeaturedExperiences from "@/components/sections/featured-experiences";
import PhilosophyBelonging from "@/components/sections/philosophy-belonging";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 overflow-hidden">
        <GlobalAtmosphere />
        <Hero />
        <ExploreWorlds />
        <FeaturedExperiences />
        <PhilosophyBelonging />
        <CommunityEnergy />
        <EditorialShowcase />
      </main>
      <FooterEcosystem />
    </>
  );
}