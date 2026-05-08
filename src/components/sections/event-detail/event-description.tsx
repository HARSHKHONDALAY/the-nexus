import SectionWrapper from "@/components/layout/section-wrapper";
import type { EventData } from "@/lib/events";

interface EventDescriptionProps {
  event: EventData;
}

export default function EventDescription({ event }: EventDescriptionProps) {
  return (
    <SectionWrapper spacing="default">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.36em] text-white/45 md:text-sm">
          Emotional Description
        </p>
        <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.03] tracking-[-0.03em] text-white md:text-[3.4rem]">
          {event.description}
        </h2>
        <p className="mt-8 text-base leading-relaxed text-white/62 md:text-xl">
          {event.longDescription}
        </p>
      </div>
    </SectionWrapper>
  );
}
