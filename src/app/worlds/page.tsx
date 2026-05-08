import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";
import ExploreWorlds from "@/components/sections/explore-worlds";
import Link from "next/link";

export default function WorldsPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="compact" blendTop blendBottom>
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
              Worlds
            </p>
            <h1 className="mt-7 font-serif text-[2.4rem] leading-[0.95] tracking-[-0.03em] text-lime-50 sm:text-[3.2rem] md:text-[4.6rem]">
              Culture rooms designed around identity and belonging.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 md:text-xl">
              Enter worlds like Chess and Art—each with a distinct atmosphere,
              community rhythm, and editorial language.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/worlds/chess-nexus"
                className="rounded-full border border-lime-300/24 bg-lime-300/10 px-5 py-2 text-xs uppercase tracking-[0.22em] text-lime-50 transition hover:border-lime-300/40 hover:bg-lime-300/16"
              >
                The Chess Nexus
              </Link>
              <Link
                href="/worlds/art-nexus"
                className="rounded-full border border-lime-300/24 bg-lime-300/10 px-5 py-2 text-xs uppercase tracking-[0.22em] text-lime-50 transition hover:border-lime-300/40 hover:bg-lime-300/16"
              >
                The Art Nexus
              </Link>
            </div>
          </div>
        </SectionWrapper>
        <ExploreWorlds />
      </main>
      <FooterEcosystem />
    </>
  );
}

