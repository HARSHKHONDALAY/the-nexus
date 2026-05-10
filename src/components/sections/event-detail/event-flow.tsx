import SectionWrapper from "@/components/layout/section-wrapper";
import type { EventData } from "@/lib/events";

interface EventFlowProps {
  event: EventData;
}

export default function EventFlow({ event }: EventFlowProps) {
  return (
    <SectionWrapper
      spacing="default"
      className="border-y border-white/10 bg-black/40"
      blendTop
      blendBottom
    >
      <div className="mb-12 md:mb-14">
        <h2 className="text-xs uppercase tracking-[0.34em] text-white/60">
          Schedule / Experience Flow
        </h2>
      </div>

      <ol className="grid gap-4">
        {event.timeline.map((item, index) => (
          <li
            key={`${item.time}-${item.title}`}
            className="rounded-3xl border border-white/10 bg-black/45 p-6 md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-12 md:items-start">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50 md:col-span-3">
                {item.time}
              </p>
              <div className="md:col-span-9">
                <h3 className="text-2xl font-semibold tracking-tight">{`${index + 1}. ${item.title}`}</h3>
                <p className="mt-3 text-white/62">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
