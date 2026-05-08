import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";

const moments = [
  "Midnight chess boards and neon silence.",
  "Art room stillness before the dialogue opens.",
  "Community laughter between curated rituals.",
  "The feeling of finding your people in one room.",
];

export default function MomentsPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="relaxed" blendTop blendBottom>
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45">Moments</p>
            <h1 className="mt-7 font-serif text-[2.5rem] leading-[0.93] tracking-[-0.03em] text-lime-50 md:text-[4.6rem]">
              A living archive of culture, memory, and belonging.
            </h1>
          </div>
        </SectionWrapper>

        <SectionWrapper spacing="compact" className="border-y border-lime-200/15 bg-black/45">
          <div className="grid gap-4 md:grid-cols-2">
            {moments.map((moment) => (
              <article
                key={moment}
                className="rounded-[1.8rem] border border-lime-200/16 bg-lime-200/[0.03] p-7"
              >
                <p className="text-lime-100/70">{moment}</p>
              </article>
            ))}
          </div>
        </SectionWrapper>
      </main>
      <FooterEcosystem />
    </>
  );
}

