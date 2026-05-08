"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

const worlds = [
  {
    title: "The Chess Nexus",
    note: "Strategy rooms and social ritual nights.",
  },
  {
    title: "The Art Nexus",
    note: "Visual dialogue spaces and immersive salons.",
  },
];

export default function WorldsCtaStrip() {
  return (
    <SectionWrapper
      spacing="compact"
      className="border-y border-lime-200/15 bg-black/55"
      blendTop
      blendBottom
    >
      <div className="mb-9 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">
            Culture Worlds
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-lime-50">
            Enter the rooms.
          </h2>
        </div>
        <Link
          href="/worlds"
          className="text-xs uppercase tracking-[0.24em] text-lime-100/72 transition hover:text-lime-50"
        >
          View all worlds
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {worlds.map((world, index) => (
          <motion.div
            key={world.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <Link
              href="/worlds"
              className="block rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] px-7 py-7 transition hover:border-lime-200/28 hover:bg-lime-200/[0.05]"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-lime-50">
                {world.title}
              </h3>
              <p className="mt-3 text-lime-100/62">{world.note}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

