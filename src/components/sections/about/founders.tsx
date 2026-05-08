"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

const founders = [
  {
    name: "Harsh Khondalay",
    role: "Founder",
    note: "Founder of Polaris Global Enterprise. Background in digital systems, strategy, and technology—focused on immersive digital experiences and premium culture ecosystems.",
  },
  {
    name: "Khushal Nile",
    role: "Co‑Founder",
    note: "Operational and strategic leadership—building the systems and growth architecture behind a modern youth culture ecosystem, with community-first conviction.",
  },
];

export default function Founders() {
  return (
    <SectionWrapper spacing="default">
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Founders
        </p>
        <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-lime-50 md:text-5xl">
          Building a house for culture worlds.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {founders.map((f, index) => (
          <motion.article
            key={f.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            className="rounded-[2rem] border border-lime-200/16 bg-lime-200/[0.03] p-8 md:p-10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-lime-100/50">
              {f.role}
            </p>
            <h3 className="mt-5 font-serif text-3xl tracking-[-0.02em] text-lime-50 md:text-4xl">
              {f.name}
            </h3>
            <p className="mt-5 text-lime-100/62">{f.note}</p>
          </motion.article>
        ))}
      </div>

      <p className="mt-8 text-xs uppercase tracking-[0.24em] text-lime-100/40">
        Note: Founder descriptions are written in an editorial tone based on information provided in this project brief.
      </p>
    </SectionWrapper>
  );
}

