"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import { events, type EventData } from "@/lib/events";

interface RelatedEventsProps {
  currentEvent: EventData;
}

export default function RelatedEvents({ currentEvent }: RelatedEventsProps) {
  const related = events.filter((event) => event.slug !== currentEvent.slug).slice(0, 2);

  return (
    <SectionWrapper spacing="default">
      <div className="mb-12 md:mb-14">
        <h2 className="text-xs uppercase tracking-[0.34em] text-white/60">Related Events</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {related.map((event, index) => (
          <motion.article
            key={event.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{event.world}</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight">{event.title}</h3>
            <p className="mt-3 text-white/62">{event.tagline}</p>
            <Link
              href={`/events/${event.slug}`}
              className="mt-7 inline-flex text-xs uppercase tracking-[0.24em] text-white/75 transition hover:text-white"
            >
              View Event
            </Link>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
