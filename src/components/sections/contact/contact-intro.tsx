import SectionWrapper from "@/components/layout/section-wrapper";

export default function ContactIntro() {
  return (
    <SectionWrapper spacing="default" blendTop blendBottom>
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Introduction
        </p>
        <h2 className="mt-7 text-[2.2rem] font-semibold leading-[1.03] tracking-[-0.03em] text-lime-50 sm:text-[3rem] md:text-[4.2rem]">
          We respond best to clarity, taste, and emotional intention.
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 sm:text-lg md:text-xl">
          The Nexus is built around belonging-first culture worlds. If you’re
          reaching out, share what you’re building, what you’re seeking, and why
          it matters.
        </p>
      </div>
    </SectionWrapper>
  );
}

