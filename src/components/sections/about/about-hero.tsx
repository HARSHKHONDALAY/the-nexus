"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_76%_24%,rgba(173,216,255,0.1),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/28 to-black" />

      <div className="container-custom relative z-10 flex min-h-[72vh] items-end pb-16 pt-36 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.38em] text-lime-100/52 md:text-sm">
            About The Nexus
          </p>
          <h1 className="mt-6 max-w-[15ch] font-serif text-[2.8rem] leading-[0.92] tracking-[-0.03em] text-lime-50 sm:text-[3.8rem] md:text-[5.2rem]">
            This is bigger than events.
            <span className="block text-lime-100/70">It’s a culture ecosystem.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-lime-100/66 md:text-xl">
            The Nexus is a belonging-first institution built as a digital headquarters
            for modern youth identity—where curated worlds, rituals, and people form a living collective.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

