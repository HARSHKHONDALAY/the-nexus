import { ArrowRight } from "lucide-react";

import Magnetic from "@/components/interactions/magnetic";
import SectionWrapper from "@/components/layout/section-wrapper";
import { Button } from "@/components/shared/button";
import type { EventData } from "@/lib/events";

interface EventTicketCtaProps {
  event: EventData;
}

export default function EventTicketCta({ event }: EventTicketCtaProps) {
  return (
    <SectionWrapper spacing="compact">
      <div className="rounded-[2rem] border border-white/12 bg-white/[0.04] p-8 md:p-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Ticket Access</p>
            <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Reserve your place in this culture room.
            </h3>
            <p className="mt-4 text-white/65">
              From {event.priceFrom} - curated entry with hosted member flow.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Magnetic className="inline-block" strength={0.15}>
              <Button variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                Reserve Spot
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
