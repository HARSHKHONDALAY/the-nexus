"use client";

import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import { motion } from "framer-motion";

import type { EventData } from "@/lib/events";

interface FloatingTicketCtaProps {
  event: EventData | null | undefined;
  label?: string;
}

export default function FloatingTicketCta({
  event,
  label = "Book Tickets",
}: FloatingTicketCtaProps) {
  // Defensive rendering guard - don't render if no event data
  if (!event || !event.title) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-lime-200/18 bg-black/84 px-4 py-3 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:inset-x-auto md:bottom-5 md:right-5 md:w-[320px] md:rounded-[1.4rem] md:border md:bg-[#04101f]/92"
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-lime-300 text-black shadow-[0_0_28px_rgba(56,189,248,0.22)] sm:flex">
            <Ticket size={18} />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-[0.98rem] font-semibold leading-6 text-lime-50">
              {event.title}
            </p>
            <p className="mt-1 text-[0.64rem] uppercase tracking-[0.14em] text-lime-100/48">
              {event.world}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.66rem] uppercase tracking-[0.16em] text-lime-100/44">
              Availability
            </p>
            <p className="mt-1 text-[0.95rem] font-medium leading-6 text-lime-50">
              {event.remainingSpots} spots left
            </p>
            <p className="text-[0.82rem] leading-6 text-lime-100/62">
              From {event.priceFrom}
            </p>
          </div>
          <Link
            href={`/register/${event.eventKey}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-lime-300/55 bg-lime-300 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-black transition hover:-translate-y-0.5 hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {label}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
