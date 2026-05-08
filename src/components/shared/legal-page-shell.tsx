import FooterEcosystem from "@/components/layout/footer-ecosystem";
import Navbar from "@/components/layout/navbar";
import SectionWrapper from "@/components/layout/section-wrapper";

interface LegalPageShellProps {
  title: string;
  description: string;
  sections: Array<{ heading: string; body: string }>;
}

export default function LegalPageShell({
  title,
  description,
  sections,
}: LegalPageShellProps) {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <SectionWrapper spacing="compact" blendTop blendBottom>
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">Legal</p>
            <h1 className="mt-6 font-serif text-[2.4rem] leading-[0.95] tracking-[-0.03em] text-lime-50 md:text-[3.8rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lime-100/62">{description}</p>
          </div>
        </SectionWrapper>

        <SectionWrapper spacing="compact">
          <div className="mx-auto grid max-w-5xl gap-5">
            {sections.map((section) => (
              <article
                key={section.heading}
                className="rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] p-7"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-lime-50">
                  {section.heading}
                </h2>
                <p className="mt-4 text-lime-100/62">{section.body}</p>
              </article>
            ))}
          </div>
        </SectionWrapper>
      </main>
      <FooterEcosystem />
    </>
  );
}

