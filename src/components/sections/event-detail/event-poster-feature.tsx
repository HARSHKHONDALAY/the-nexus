"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import SectionWrapper from "@/components/layout/section-wrapper";
import { Button } from "@/components/shared/button";
import { getEventMedia } from "@/lib/event-media";
type EventData = any;

interface EventPosterFeatureProps {
  event: EventData;
}

export default function EventPosterFeature({ event }: EventPosterFeatureProps) {
  const media = getEventMedia(event);
  const poster = media.posters[0];

  if (!poster) return null;

  return (
    <SectionWrapper spacing="default" className="bg-black/35" blendTop blendBottom>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(300px,0.46fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/55">
            Poster Signal
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl">
            A visual invitation before the room becomes memory.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62 md:text-lg">
            The poster stays close to ticket intent: date, place, atmosphere, and the
            creative promise of the session in one premium frame.
          </p>
          <div className="mt-8">
            <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
              <Link href={`/register/${event.eventKey}`}>Buy Tickets</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.32 }}
          className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.04] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            sizes="(max-width: 1024px) 80vw, 360px"
            className="h-auto w-full rounded-[1.1rem]"
            
          />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
