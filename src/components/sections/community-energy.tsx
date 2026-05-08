"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";

export default function CommunityEnergy() {
  return (
    <SectionWrapper
      id="community-energy"
      spacing="default"
      className="overflow-hidden border-y border-lime-200/15 bg-black/45"
      blendTop
      blendBottom
    >
      <SectionHeading
        eyebrow="Community Energy"
        title="A living signal shaped by people, not algorithms."
        description="From intimate room conversations to large collective nights, the energy evolves through community participation."
      />

      <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-lime-200/16 bg-black/50 p-7 md:col-span-8 md:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.2),transparent_44%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-lime-200/[0.04] to-transparent" />
          <motion.div
            aria-hidden
            className="absolute -right-10 top-12 h-40 w-40 rounded-full bg-violet-400/15 blur-[70px]"
            animate={{ y: [0, -10, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">
              This Week at The Nexus
            </p>
            <h3 className="mt-5 max-w-[24ch] text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-4xl">
              4 culture worlds, 12 curated rooms, one shared sense of belonging.
            </h3>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-lime-100/62 md:text-lg">
              Members move between chess salons, creator workshops, art
              dialogues, and social evenings as one ecosystem, each room adding
              to a larger cultural narrative.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.95,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true, amount: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-lime-200/16 bg-black/45 p-7 md:col-span-4 md:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(124,58,237,0.2),transparent_44%)]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-lime-100/48">
              Live Pulse
            </p>
            <ul className="mt-6 space-y-6">
              <li>
                <p className="text-3xl font-semibold tracking-tight text-lime-50">20K+</p>
                <p className="mt-1 text-sm text-lime-100/58">Community reach</p>
              </li>
              <li>
                <p className="text-3xl font-semibold tracking-tight text-lime-50">150+</p>
                <p className="mt-1 text-sm text-lime-100/58">Curated experiences</p>
              </li>
              <li>
                <p className="text-3xl font-semibold tracking-tight text-lime-50">4</p>
                <p className="mt-1 text-sm text-lime-100/58">Identity worlds</p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
