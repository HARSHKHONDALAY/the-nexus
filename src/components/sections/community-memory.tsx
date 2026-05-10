"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";

const memories = [
  {
    title: "The first-time solo guest",
    body: "They arrive early, check the room twice, and by the end they are in a small circle debating openings, colours, coffee, and where everyone is meeting next.",
  },
  {
    title: "The table that becomes familiar",
    body: "In art rooms, people begin quietly. Then someone asks about a texture, someone shares a colour, and the table becomes softer than the city outside.",
  },
  {
    title: "The aftertaste",
    body: "The best sign is not a photograph. It is when people leave with a name saved, a plan made, and a small feeling that this city has more of their kind.",
  },
];

const rituals = ["Hosted introductions", "Limited seats", "Return invitations", "Community memory"];

export default function CommunityMemory() {
  return (
    <SectionWrapper id="community-memory" spacing="default">
      <SectionHeading
        eyebrow="Why People Return"
        title="The Nexus is built around emotional memory, not one-night hype."
        description="A premium room should feel beautiful in the moment and personal afterwards. We design for both: the arrival, the chemistry, and the reason to come back."
      />

      <div className="mt-14 grid gap-5 md:mt-16 md:grid-cols-3">
        {memories.map((memory, index) => (
          <motion.article
            key={memory.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl border border-lime-200/14 bg-lime-100/[0.03] p-7 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-lime-100/42">
              Memory {index + 1}
            </p>
            <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-lime-50">
              {memory.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-lime-100/62 md:text-base">
              {memory.body}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {rituals.map((ritual) => (
          <span
            key={ritual}
            className="rounded-full border border-lime-200/14 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.22em] text-lime-100/52"
          >
            {ritual}
          </span>
        ))}
      </div>
    </SectionWrapper>
  );
}
