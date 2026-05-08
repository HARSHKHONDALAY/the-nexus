"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Magnetic from "@/components/interactions/magnetic";
import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";
import { Button } from "@/components/shared/button";

const featuredExperiences = [
  {
    title: "After Hours Chess Salon",
    detail: "Mumbai 10:30 PM",
    note: "An intimate strategy night with sound, storytelling, and curated pairings.",
  },
  {
    title: "Art House Sessions",
    detail: "Bandra 7:00 PM",
    note: "Live installations, emerging artists, and conversation-led curation.",
  },
  {
    title: "The Social Edit Night",
    detail: "SoBo 9:00 PM",
    note: "A belonging-first evening built for thoughtful introductions and cultural chemistry.",
  },
];

export default function FeaturedExperiences() {
  return (
    <SectionWrapper
      id="featured-experiences"
      className="border-y border-lime-200/12 bg-black/40"
      spacing="default"
      blendTop
      blendBottom
    >
      <SectionHeading
        eyebrow="Featured Experiences"
        title="Curated moments that feel deeply human."
        description="Designed with editorial rigor and emotional intention, each experience is crafted as a memory-first environment."
      />

      <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
        {featuredExperiences.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="group overflow-hidden rounded-3xl border border-lime-200/16 bg-black/35 transition-colors duration-500 hover:border-lime-200/28"
          >
            <div className="relative h-56 overflow-hidden md:h-64">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.22),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(124,58,237,0.28),transparent_45%)] transition-transform duration-1000 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/85" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:240%_100%] bg-[position:100%_0] group-hover:bg-[position:0_0]" />
            </div>
            <div className="p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-lime-100/48">
                {item.detail}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-lime-50">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-lime-100/62 md:text-base">
                {item.note}
              </p>
              <Magnetic className="mt-6 inline-block" strength={0.11}>
                <Button
                  variant="ghost"
                  className="px-0 text-xs uppercase tracking-[0.22em] hover:bg-transparent"
                  endIcon={<ArrowUpRight size={14} />}
                >
                  View Story
                </Button>
              </Magnetic>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
