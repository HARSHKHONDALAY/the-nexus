import SectionWrapper from "@/components/layout/section-wrapper";
type EventData = any;
import { Button } from "@/components/shared/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EventDescriptionProps {
  event: EventData;
}

export default function EventDescription({ event }: EventDescriptionProps) {
  return (
    <SectionWrapper spacing="default">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.36em] text-white/60 md:text-sm">
          The Feeling
        </p>
        <h2 className="mt-6 text-[2.1rem] font-semibold leading-[1.03] tracking-[-0.03em] text-white md:text-[3.4rem]">
          {event.description}
        </h2>
        <p className="mt-8 text-base leading-relaxed text-white/62 md:text-xl">
          {event.longDescription}
        </p>
        <div className="mt-9 flex justify-center">
          <Button asChild variant="secondary" size="roomy" endIcon={<ArrowRight size={16} />}>
            <Link href={`/register/${event.eventKey}`} className="text-lime-50 visited:text-lime-50">
              Reserve Your Seat
            </Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
