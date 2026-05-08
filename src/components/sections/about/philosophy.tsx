"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

const pillars = [
  {
    title: "Belonging as architecture",
    body: "We design for emotional safety and social clarity. People should feel seen before they feel sold to.",
  },
  {
    title: "Culture worlds, not categories",
    body: "Identity is not a filter. Each world is a room with taste, rhythm, and a community that recognizes itself.",
  },
  {
    title: "Curated social energy",
    body: "The energy is composed: sequence, light, sound, and hosting work together to create human connection.",
  },
];

export default function Philosophy() {
  return (
    <SectionWrapper spacing="relaxed" blendTop blendBottom>
      <div className="grid gap-10 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
            Philosophy
          </p>
          <h2 className="mt-7 text-[2.2rem] font-semibold leading-[1.03] tracking-[-0.03em] text-lime-50 sm:text-[3rem] md:text-[4.2rem]">
            Belonging is the product.
            <span className="mt-2 block text-lime-100/72">Everything else is a system.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:col-span-7">
          {pillars.map((p, index) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.35 }}
              className="rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] p-7 md:p-8"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-lime-50">
                {p.title}
              </h3>
              <p className="mt-4 text-lime-100/62">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

