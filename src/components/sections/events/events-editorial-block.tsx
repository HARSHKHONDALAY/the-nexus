"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

export default function EventsEditorialBlock() {
  return (
    <SectionWrapper spacing="relaxed">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Editorial Note
        </p>
        <h2 className="mt-7 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-lime-50 sm:text-[3rem] md:text-[4.2rem]">
          Every event is designed as a living chapter in the Nexus story.
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 sm:text-lg md:text-xl">
          We do not publish generic listings. We curate atmosphere, sequence,
          and people so each gathering feels intentional, emotionally resonant,
          and deeply connected to culture.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
