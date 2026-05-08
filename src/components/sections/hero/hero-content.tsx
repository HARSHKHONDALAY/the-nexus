"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import { heroDelayed, heroEntrance } from "@/components/sections/hero/motion";

export default function HeroContent() {
  return (
    <div className="container-custom relative z-10 flex min-h-screen items-center pb-16 pt-32 md:pb-20">
      <div className="max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroEntrance}
          className="text-[0.64rem] uppercase tracking-[0.4em] text-white/55 sm:text-xs md:text-sm"
        >
          Collective Intelligence Field
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroDelayed(0.06)}
          className="mt-6 max-w-[16ch] font-serif text-[2.7rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-[3.5rem] md:mt-8 md:text-[5.2rem] lg:text-[6.4rem]"
        >
          A living collective, forming in real time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroDelayed(0.16)}
          className="mt-7 max-w-2xl text-base leading-relaxed text-white/66 sm:text-lg md:mt-9 md:text-xl"
        >
          Move through the field to feel how individual signals gather,
          disperse, and reform into one shared cultural organism.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroDelayed(0.24)}
          className="mt-9 flex flex-wrap items-center gap-3 md:mt-11 md:gap-4"
        >
          <Magnetic className="inline-block" strength={0.16}>
            <Button
              variant="primary"
              size="roomy"
              endIcon={<ArrowRight size={16} />}
            >
              Explore Experiences
            </Button>
          </Magnetic>

          <Magnetic className="inline-block" strength={0.12}>
            <Button variant="ghost" size="roomy">
              Join Community
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
