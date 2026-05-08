"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { EventData } from "@/lib/events";

interface EventCardProps {
  event: EventData;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.7rem] border border-lime-200/18 bg-lime-200/[0.04]"
    >
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(145,255,98,0.24),transparent_40%),radial-gradient(circle_at_20%_82%,rgba(170,222,255,0.15),transparent_45%)] transition-transform duration-1000 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/85" />
      </div>
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/52">
          <span className="rounded-full border border-lime-300/24 px-3 py-1">
            {event.world}
          </span>
          <span className="rounded-full border border-lime-300/18 bg-lime-300/10 px-3 py-1 text-lime-50/90">
            {event.type}
          </span>
          <span>{event.date}</span>
        </div>

        <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-lime-50">
          {event.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-lime-100/62 md:text-base">
          {event.tagline}
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-lime-100/45">
          From {event.priceFrom} · {event.remainingSpots} spots remaining
        </p>

        <Link
          href={`/events/${event.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-lime-100/78 transition-colors hover:text-lime-50"
        >
          View Event <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
