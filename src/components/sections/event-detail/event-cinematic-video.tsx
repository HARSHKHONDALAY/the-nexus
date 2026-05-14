"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import SectionWrapper from "@/components/layout/section-wrapper";
import { Button } from "@/components/shared/button";
import { getBackgroundVideo, getPrimaryHeroImage } from "@/lib/event-media";
import type { EventData } from "@/lib/types/api";

interface EventCinematicVideoProps {
  event: EventData;
}

export default function EventCinematicVideo({ event }: EventCinematicVideoProps) {
  const video = getBackgroundVideo(event);
  const fallbackImage = getPrimaryHeroImage(event);

  if (!video?.src) return null;

  return (
    <SectionWrapper
      spacing="default"
      className="overflow-hidden border-y border-cyan-100/10 bg-[#020617]"
      blendTop
      blendBottom
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        className="relative min-h-[62vh] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_110px_rgba(0,0,0,0.42)]"
      >
        <Image
          src={fallbackImage.src}
          alt={`${event.title} room preview still`}
          fill
          sizes="(max-width: 768px) 100vw, 86vw"
          className="object-cover opacity-70 saturate-[0.82]"
          
        />
        <video
          className="absolute inset-0 hidden h-full w-full object-cover opacity-72 saturate-[0.82] md:block"
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={String((fallbackImage as { src: string }).src)}
          aria-label={`${event.title} ${video.label.toLowerCase()} footage`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(103,232,249,0.16),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.48)_58%,rgba(0,0,0,0.74))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />

        <div className="relative z-10 flex min-h-[62vh] max-w-3xl flex-col justify-end p-6 md:p-10 lg:p-12">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/62">
            Room Preview
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl">
            A night calibrated for focus, pressure, and social electricity.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/66 md:text-lg">
            Motion stays behind the story: fast enough to feel alive, restrained enough
            to keep the ticket path clear.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
              <Link href={`/register/${event.eventKey}`}>Buy Tickets</Link>
            </Button>
            <Button asChild variant="secondary" size="roomy">
              <Link href="#registration">View Tickets</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
