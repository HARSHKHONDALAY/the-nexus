import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";

export default function ChessNexusPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="relaxed" blendTop blendBottom>
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
              The Chess Nexus
            </p>
            <h1 className="mt-7 font-serif text-[2.6rem] leading-[0.92] tracking-[-0.03em] text-lime-50 sm:text-[3.4rem] md:text-[4.8rem]">
              Strategy as social ritual.
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 md:text-xl">
              A culture room for minds in motion—late-night salons, curated pairings,
              and quiet intensity designed to turn focus into connection.
            </p>
          </div>
        </SectionWrapper>
      </main>
      <FooterEcosystem />
    </>
  );
}

