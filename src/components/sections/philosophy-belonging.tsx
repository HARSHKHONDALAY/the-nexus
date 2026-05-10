"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

export default function PhilosophyBelonging() {
  return (
    <SectionWrapper id="philosophy" spacing="relaxed">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-5xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.38em] text-white/45 md:text-sm">
          The Parent Ecosystem
        </p>
        <h2 className="mt-7 text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.2rem] md:text-[4.5rem]">
          The Nexus is the house.
          <span className="mt-2 block text-white/75">
            Chess and art are the first rooms.
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-white/62 sm:text-lg md:text-xl">
          The Chess Nexus carries sharp minds, cafe-table rivalry, and the joy
          of meeting someone across a board. The Art Nexus carries softer
          expression, shared materials, and emotional ease. Together, they form a
          larger belonging system that can grow into music, film, design, and
          founder rooms without losing its human centre.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
