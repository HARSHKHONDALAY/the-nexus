"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";

const worlds = [
  {
    title: "The Chess Nexus",
    href: "/worlds/chess-nexus",
    note: "Quiet intensity. Strategy as culture. Social ritual, composed.",
  },
  {
    title: "The Art Nexus",
    href: "/worlds/art-nexus",
    note: "Visual dialogue. Salon energy. Immersive creative belonging.",
  },
];

export default function AboutCultureWorlds() {
  return (
    <SectionWrapper
      spacing="default"
      className="border-y border-lime-200/15 bg-black/50"
      blendTop
      blendBottom
    >
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.36em] text-lime-100/45 md:text-sm">
          Culture Worlds
        </p>
        <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-lime-50 md:text-5xl">
          Worlds are identity rooms—built to be entered.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {worlds.map((world, index) => (
          <motion.div
            key={world.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <Link
              href={world.href}
              className="group block rounded-[2rem] border border-lime-200/16 bg-lime-200/[0.03] p-8 transition hover:border-lime-200/28 hover:bg-lime-200/[0.05] md:p-10"
            >
              <h3 className="font-serif text-3xl tracking-[-0.02em] text-lime-50 md:text-4xl">
                {world.title}
              </h3>
              <p className="mt-5 max-w-[46ch] text-lime-100/62">{world.note}</p>
              <p className="mt-7 text-xs uppercase tracking-[0.24em] text-lime-100/60 transition group-hover:text-lime-50">
                Enter world
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

