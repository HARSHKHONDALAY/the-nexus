"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import { getEventMedia } from "@/lib/event-media";
import type { EventData } from "@/lib/events";

interface EventGalleryProps {
  event: EventData;
}

export default function EventGallery({ event }: EventGalleryProps) {
  const media = getEventMedia(event);
  const gallery = media.galleryImages;
  const title =
    event.world === "The Art Nexus"
      ? "Creative proof, finished work, and the energy inside the room."
      : "Real rooms. Real tension. A social ritual around the board.";

  return (
    <SectionWrapper
      spacing="default"
      className="overflow-hidden border-y border-white/10 bg-black/45"
      blendTop
      blendBottom
    >
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.34em] text-white/60">Visual Gallery</p>
        <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {title}
        </h2>
      </div>

      <div className="grid auto-rows-[220px] gap-4 md:auto-rows-[260px] md:grid-cols-12 md:gap-5">
        {gallery.length > 0 ? gallery.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${item.className ?? "md:col-span-4"}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
              className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.045]"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/18 to-black/88" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/78">
                {item.label}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/72">
                {item.intent}
              </p>
            </div>
          </motion.article>
        )) : event.gallery.map((item, index) => (
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
            <div className="h-full bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.22),transparent_38%),radial-gradient(circle_at_22%_82%,rgba(139,92,246,0.25),transparent_44%)] transition-transform duration-1000 group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />
            <p className="absolute bottom-6 left-6 text-sm uppercase tracking-[0.2em] text-white/78">{item}</p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
}
