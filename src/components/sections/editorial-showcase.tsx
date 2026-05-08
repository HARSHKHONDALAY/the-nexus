"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";

const editorialStories = [
  {
    title: "Inside the Chess Nexus",
    type: "Cultural essay",
  },
  {
    title: "Creators on Community Architecture",
    type: "Studio conversation",
  },
  {
    title: "Building Social Rooms That Matter",
    type: "Field notes",
  },
];

export default function EditorialShowcase() {
  return (
    <SectionWrapper id="editorial-showcase" spacing="default" blendTop blendBottom>
      <SectionHeading
        eyebrow="Editorial Showcase"
        title="Stories, perspectives, and culture reports from inside the ecosystem."
        description="The Nexus editorial layer captures the meaning behind the moments, shaping a shared cultural memory."
      />

      <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-12">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="group relative overflow-hidden rounded-3xl border border-lime-200/16 bg-black/35 p-8 transition-colors duration-500 hover:border-lime-200/28 md:col-span-7 md:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.16),transparent_38%),radial-gradient(circle_at_84%_84%,rgba(168,85,247,0.16),transparent_40%)]" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:240%_100%] bg-[position:100%_0] group-hover:bg-[position:0_0]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.32em] text-lime-100/48">
              Longform Feature
            </p>
            <h3 className="mt-6 max-w-[24ch] text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-4xl">
              Why belonging is the most important product decision in modern community.
            </h3>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-lime-100/62 md:text-lg">
              A deep dive into how curation, emotional design, and identity-led
              rooms create a premium social experience people return to.
            </p>
          </div>
        </motion.article>

        <div className="grid gap-5 md:col-span-5">
          {editorialStories.map((story, index) => (
            <motion.article
              key={story.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] p-6 md:p-7"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-lime-100/48">
                {story.type}
              </p>
              <h4 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-lime-50">
                {story.title}
              </h4>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
