"use client";

import { motion } from "framer-motion";

import type { EventData } from "@/lib/events";

interface EventHeroProps {
  event: EventData;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_20%,rgba(139,92,246,0.22),transparent_42%),radial-gradient(circle_at_16%_16%,rgba(59,130,246,0.14),transparent_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black" />

      <div className="container-custom relative z-10 flex min-h-[92vh] items-end pb-20 pt-40 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
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
              {event.city}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
