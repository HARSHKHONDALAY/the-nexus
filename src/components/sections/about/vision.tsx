"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

export default function Vision() {
  return (
    <SectionWrapper
      spacing="default"
      className="border-y border-lime-200/15 bg-black/45"
      blendTop
      blendBottom
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Vision
        </p>
        <h2 className="mt-7 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-lime-50 sm:text-[3.1rem] md:text-[4.4rem]">
          A digital cultural headquarters.
          <span className="mt-2 block text-lime-100/72">An evolving movement.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 sm:text-lg md:text-xl">
          The Nexus is built to hold modern youth identity in a premium way—through
          worlds that feel like rooms, experiences that feel like rituals, and a community
          that feels like home. We’re not building a feed. We’re building a house.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}

