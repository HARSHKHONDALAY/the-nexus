import SectionWrapper from "@/components/layout/section-wrapper";
import type { EventData } from "@/lib/events";

interface EventCommunityVibeProps {
  event: EventData;
}

export default function EventCommunityVibe({ event }: EventCommunityVibeProps) {
  return (
    <SectionWrapper spacing="default">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.34em] text-white/45">Community Vibe</p>
          <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            The room energy is designed for connection, curiosity, and shared taste.
          </h3>
        </div>
        <div className="md:col-span-7">
          <ul className="space-y-4">
            {event.vibePoints.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-white/75"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
