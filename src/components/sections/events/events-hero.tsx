"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shared/button";
import { events } from "@/lib/events";

export default function EventsHero() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(146,255,103,0.16),transparent_36%),radial-gradient(circle_at_78%_22%,rgba(173,216,255,0.1),transparent_32%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />

      <div className="container-custom relative z-10 flex min-h-[72vh] items-end pb-16 pt-36 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.38em] text-lime-100/52 md:text-sm">
            Events Archive
          </p>
          <h1 className="mt-6 max-w-[14ch] font-serif text-[2.8rem] leading-[0.9] tracking-[-0.03em] text-lime-50 sm:text-[3.8rem] md:text-[5.4rem]">
            Curated culture experiences, composed with emotional precision.
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-lime-100/66 md:text-xl">
            Explore the evolving event language of The Nexus across chess and art
            worlds, from intimate room sessions to larger social rituals.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
              <Link href={`/register/${featuredEvent.eventKey}`}>Book Featured Tickets</Link>
            </Button>
            <Button asChild variant="secondary" size="roomy">
              <Link href={`/events/${featuredEvent.slug}`}>{featuredEvent.remainingSpots} spots left</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
