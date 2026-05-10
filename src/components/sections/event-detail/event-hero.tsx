import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shared/button";
import { getPrimaryHeroImage } from "@/lib/event-media";
import type { EventData } from "@/lib/events";

interface EventHeroProps {
  event: EventData;
}

export default function EventHero({ event }: EventHeroProps) {
  const heroImage = getPrimaryHeroImage(event);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-black">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover opacity-78 saturate-[0.82] contrast-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94),rgba(2,8,23,0.66)_42%,rgba(2,8,23,0.30)_72%,rgba(0,0,0,0.76))]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />

      <div className="container-custom relative z-10 flex min-h-[92vh] items-end pb-20 pt-40 md:pb-24">
        <div className="max-w-5xl">
          <p className="text-xs uppercase tracking-[0.38em] text-white/50 md:text-sm">
            {event.world}
          </p>
          <h1 className="mt-5 font-serif text-[2.8rem] leading-[0.9] tracking-[-0.04em] text-white sm:text-[3.8rem] md:text-[5.2rem] lg:text-[6.5rem]">
            {event.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/68 md:text-xl">
            {event.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-white/55 md:mt-10">
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
              {event.date}
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
              {event.time}
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
              {event.remainingSpots} spots left
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
              <Link href={`/register/${event.eventKey}`}>Buy Tickets</Link>
            </Button>
            <Button asChild variant="secondary" size="roomy">
              <Link href="#registration">View Ticket Tiers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
