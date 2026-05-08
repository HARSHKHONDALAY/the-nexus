"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";
import GlassCard from "@/components/shared/glass-card";

const energyItems = [
  {
    title: "Underground Chess Nights",
    description:
      "Late-night strategy sessions, curated playlists, and culture-driven gatherings.",
  },
  {
    title: "Creative Socials",
    description:
      "Meet filmmakers, artists, founders, musicians, and people building meaningful things.",
  },
  {
    title: "Immersive Event Experiences",
    description:
      "Events designed around emotion, atmosphere, belonging, and unforgettable energy.",
  },
];

export default function CurrentEnergy() {
  return (
    <SectionWrapper>
      <SectionHeading
        eyebrow="Current Energy"
        title="The cultural pulse of The Nexus."
        description="A living ecosystem of events, people, creativity, and meaningful experiences."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {energyItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
          >
            <GlassCard className="h-full p-8">
              <div className="mb-8 h-2 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />

              <h3 className="text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>

              <p className="mt-4 leading-relaxed text-white/60">
                {item.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}