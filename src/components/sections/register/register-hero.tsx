"use client";

import { motion } from "framer-motion";

import type { EventData } from "@/lib/events";

interface RegisterHeroProps {
  event: EventData;
}

export default function RegisterHero({ event }: RegisterHeroProps) {
  return (
    <section className="relative isolate min-h-[56vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(56,189,248,0.16),transparent_36%),radial-gradient(circle_at_78%_22%,rgba(173,216,255,0.1),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black" />

      <div className="container-custom relative z-10 flex min-h-[56vh] items-end pb-14 pt-36 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.36em] text-lime-100/50 md:text-sm">
            Registration
          </p>
          <h1 className="mt-6 max-w-[16ch] font-serif text-[2.5rem] leading-[0.92] tracking-[-0.03em] text-lime-50 sm:text-[3.4rem] md:text-[4.6rem]">
            {event.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-lime-100/64 md:text-lg">
            Access is curated. Choose your tier and submit your request to join this culture room.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

