"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/shared/button";
import { getEventCardImage } from "@/lib/event-media";
import type { EventData } from "@/lib/events";

interface EventCardProps {
  event: EventData;
}

export default function EventCard({ event }: EventCardProps) {
  // Safe thumbnail access with fallback
  const thumbnail = (() => {
    try {
      const img = getEventCardImage(event);
      return img || { src: "/events/default-thumbnail.jpg", alt: event.title || "Event" };
    } catch (error) {
      console.error('Failed to get event card image:', error);
      return { src: "/events/default-thumbnail.jpg", alt: event.title || "Event" };
    }
  })();

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.7rem] border border-lime-200/18 bg-lime-200/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
    >
      <div className="relative h-52 overflow-hidden rounded-t-[1.7rem] bg-black">
        <Image
          src={thumbnail?.src ?? "/events/default-thumbnail.jpg"}
          alt={thumbnail?.alt ?? event.title ?? "Event"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition duration-1000 ease-out group-hover:scale-[1.03] group-hover:opacity-95"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
      </div>
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-lime-100/52">
          <span className="rounded-full border border-lime-300/24 px-3 py-1">
            {event.world}
          </span>
          <span className="rounded-full border border-lime-300/18 bg-lime-300/10 px-3 py-1 text-lime-50/90">
            {event.type}
          </span>
          <span>{event.date}</span>
        </div>

        <h3 className="mt-4 text-[1.65rem] font-semibold leading-[1.07] tracking-[-0.03em] text-lime-50">
          {event.title}
        </h3>
        <p className="mt-3 text-[0.98rem] leading-7 text-lime-100/62">
          {event.tagline}
        </p>
        <p className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-lime-100/45">
          From {event.priceFrom} · {event.remainingSpots} spots remaining
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild variant="primary" size="compact" endIcon={<ArrowRight size={14} />}>
            <Link href={`/register/${event.eventKey}`}>Book Tickets</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="compact"
            className="border border-lime-300/16 px-4 text-[0.67rem] tracking-[0.16em] text-lime-100/78 hover:border-lime-300/34 hover:bg-lime-300/[0.08] hover:text-lime-50"
            endIcon={<ArrowUpRight size={14} />}
          >
            <Link href={`/events/${event.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
