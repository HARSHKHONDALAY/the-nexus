"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

const worlds = [
  {
    title: "The Chess Nexus",
    note: "Warm rivalry, cafe-table strategy, hosted pairings, and people who enjoy thinking out loud.",
  },
  {
    title: "The Art Nexus",
    note: "Soft creative rooms where expression feels guided, social, and emotionally easy.",
  },
];

export default function CultureWorldsStrip() {
  return (
    <SectionWrapper
      spacing="compact"
      className="border-y border-lime-200/15 bg-black/50"
      blendTop
      blendBottom
    >
      <div className="mb-9">
        <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">
          The Nexus Ecosystem
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-5xl">
          One parent house. Distinct rooms. More worlds coming.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {worlds.map((world, index) => (
          <motion.article
            key={world.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.35 }}
            className="rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] px-6 py-6 md:px-8"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-lime-50">
              {world.title}
            </h3>
            <p className="mt-3 text-lime-100/62">{world.note}</p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
