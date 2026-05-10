import SectionWrapper from "@/components/layout/section-wrapper";
import type { EventData } from "@/lib/events";

interface EventMetadataProps {
  event: EventData;
}

export default function EventMetadata({ event }: EventMetadataProps) {
  const metadata = [
    { label: "Date", value: event.date },
    { label: "Time", value: event.time },
    { label: "Venue", value: `${event.venue}, ${event.city}` },
    { label: "Capacity", value: event.capacity },
    { label: "Dress code", value: event.dressCode },
    { label: "Age", value: event.agePolicy },
  ];

  return (
    <SectionWrapper spacing="compact" blendTop blendBottom>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {metadata.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">
              {item.label}
            </p>
            <p className="mt-4 text-lg leading-snug text-white/90 md:text-xl">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
