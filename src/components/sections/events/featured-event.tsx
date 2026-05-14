"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import type { EventData } from "@/lib/types/api";

interface FeaturedEventProps {
  event: EventData | null | undefined;
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  // Defensive rendering guard - return empty state if no event
  if (!event || !event.title) {
    return (
      <SectionWrapper spacing="default" blendTop blendBottom>
        <div className="relative overflow-hidden rounded-[2rem] border border-lime-200/18 bg-lime-200/[0.04] p-8 md:p-12">
          <div className="text-center text-lime-100/60">
            <p>No featured event available</p>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="default" blendTop blendBottom>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.32 }}
        className="relative overflow-hidden rounded-[2rem] border border-lime-200/18 bg-lime-200/[0.04] p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_8%_80%,rgba(173,216,255,0.12),transparent_36%)]" />
        <div className="relative z-10 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.36em] text-lime-100/52">
              Featured Event
            </p>
            <h2 className="mt-6 max-w-[20ch] text-4xl font-semibold tracking-tight text-lime-50 md:text-5xl">
              {event.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-lime-100/66 md:text-lg">
              {event.longDescription}
            </p>
          </div>

          <div className="md:col-span-4 md:justify-self-end">
            <p className="text-xs uppercase tracking-[0.26em] text-lime-100/50">
              {event.date} · {event.time}
            </p>
            <p className="mt-2 text-sm text-lime-100/62">{event.venue}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-lime-100/48">
              From {event.priceFrom} · {event.remainingSpots} spots remaining
            </p>

            <Magnetic className="mt-7 inline-block" strength={0.14}>
              <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                <Link href={`/register/${event.eventKey}`}>
                  Reserve This Experience
                </Link>
              </Button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
