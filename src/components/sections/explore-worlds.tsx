"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";
import WorldPortalCard from "@/components/sections/world-portal-card";

const worlds = [
  {
    title: "The Chess Nexus",
    mood: "Quiet intensity",
    description:
      "Strategy sessions, late-night tournaments, and modern mind culture in an elevated social setting.",
    atmosphere:
      "bg-[radial-gradient(circle_at_82%_14%,rgba(145,255,98,0.24),transparent_48%),radial-gradient(circle_at_18%_82%,rgba(74,222,128,0.18),transparent_42%)]",
  },
  {
    title: "The Art Nexus",
    mood: "Visual dialogue",
    description:
      "Curated exhibitions, intimate artist rooms, and immersive creative gatherings designed for expression.",
    atmosphere:
      "bg-[radial-gradient(circle_at_76%_18%,rgba(163,255,76,0.25),transparent_46%),radial-gradient(circle_at_14%_80%,rgba(134,239,172,0.16),transparent_40%)]",
  },
];

export default function ExploreWorlds() {
  return (
    <SectionWrapper id="worlds" spacing="relaxed" blendTop blendBottom>
      <SectionHeading
        eyebrow="Explore The Worlds"
        title="Step into culture worlds designed around identity and belonging."
        description="The Nexus worlds are immersive editorial rooms, each with a distinct emotional atmosphere and social rhythm."
      />

      <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2">
        {worlds.map((world, index) => (
          <motion.div
            key={world.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <WorldPortalCard {...world} />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
