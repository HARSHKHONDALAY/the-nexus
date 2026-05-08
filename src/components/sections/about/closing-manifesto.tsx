"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

export default function ClosingManifesto() {
  return (
    <SectionWrapper spacing="relaxed" blendTop blendBottom>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Manifesto
        </p>
        <h2 className="mt-7 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-lime-50 sm:text-[3.1rem] md:text-[4.4rem]">
          Belonging is the future of premium.
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-lime-100/62 sm:text-lg md:text-xl">
          We are building a living institution where individuals form a collective—through
          culture worlds, ritual experiences, and emotionally intelligent design.
          The Nexus is a place you return to because it remembers you.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}

