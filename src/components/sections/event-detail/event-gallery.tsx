"use client";

import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import type { EventData } from "@/lib/events";

interface EventGalleryProps {
  event: EventData;
}

export default function EventGallery({ event }: EventGalleryProps) {
  return (
    <SectionWrapper
      spacing="default"
      className="overflow-hidden border-y border-white/10 bg-black/45"
      blendTop
      blendBottom
    >
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.34em] text-white/45">Visual Gallery</p>
      </div>

      <div className="grid gap-5 md:grid-cols-12">
        {event.gallery.map((item, index) => (
          <motion.article
            key={item}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 ${
              index === 0 ? "md:col-span-7" : "md:col-span-5"
            }`}
          >
            <div className="h-64 bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.22),transparent_38%),radial-gradient(circle_at_22%_82%,rgba(139,92,246,0.25),transparent_44%)] transition-transform duration-1000 group-hover:scale-[1.05] md:h-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />
            <p className="absolute bottom-6 left-6 text-sm uppercase tracking-[0.2em] text-white/78">
              {item}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
