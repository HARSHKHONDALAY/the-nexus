import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";

export default function JoinPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="relaxed" blendTop blendBottom>
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">Join</p>
            <h1 className="mt-7 font-serif text-[2.5rem] leading-[0.93] tracking-[-0.03em] text-lime-50 md:text-[4.6rem]">
              Apply to enter the culture house.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lime-100/62 md:text-lg">
              Membership is curated for intent, contribution, and community energy.
              We optimize for people who want to build meaningful culture together.
            </p>
          </div>
        </SectionWrapper>
      </main>
      <FooterEcosystem />
    </>
  );
}

