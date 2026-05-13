import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Magnetic from "@/components/interactions/magnetic";
import SectionWrapper from "@/components/layout/section-wrapper";
import { Button } from "@/components/shared/button";
type EventData = any;

interface EventTicketCtaProps {
  event: EventData;
}

export default function EventTicketCta({ event }: EventTicketCtaProps) {
  return (
    <SectionWrapper spacing="compact">
      <div className="relative overflow-hidden rounded-[2rem] border border-lime-200/18 bg-lime-200/[0.055] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(173,216,255,0.12),transparent_38%)]" />
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="relative md:col-span-8">
            <p className="text-xs uppercase tracking-[0.32em] text-lime-100/70">Ticket Access</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {event.remainingSpots} seats remain for this room.
            </h2>
            <p className="mt-4 text-lime-100/65">
              From {event.priceFrom}. Hosted entry, curated flow, and a night designed to feel socially magnetic.
            </p>
          </div>
          <div className="relative md:col-span-4 md:justify-self-end">
            <Magnetic className="inline-block" strength={0.15}>
              <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                <Link href={`/register/${event.eventKey}`}>Reserve Your Spot</Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
