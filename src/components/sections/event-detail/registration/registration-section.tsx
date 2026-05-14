"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import TierCard from "@/components/sections/event-detail/registration/tier-card";

import type { EventData } from "@/lib/types/api";
import type { TicketTierData } from "@/lib/types/api";

interface RegistrationSectionProps {
  event: EventData;
}

export default function RegistrationSection({
  event,
}: RegistrationSectionProps) {
  const availableTiers =
    event.ticketTiers.filter(
      (t: TicketTierData) => t.status !== "sold_out"
    );

  const [selectedTierId, setSelectedTierId] =
    useState<string>(
      availableTiers[0]?.id ??
        event.ticketTiers[0]?.id ??
        ""
    );

  const selectedTier = useMemo(
    () =>
      event.ticketTiers.find(
        (t: TicketTierData) => t.id === selectedTierId
      ),
    [event.ticketTiers, selectedTierId]
  );

  return (
    <SectionWrapper
      id="registration"
      spacing="default"
      className="border-y border-lime-200/15 bg-black/45"
      blendTop
      blendBottom
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.34em] text-lime-100/70">
            Registration
          </p>

          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-lime-50 md:text-4xl">
            Reserve your place in this culture room.
          </h2>

          <p className="mt-6 max-w-[46ch] text-lime-100/62">
            Access is curated. Choose a tier, then request entry through the house.
            This is designed to feel exclusive, calm, and intentional—not transactional.
          </p>

          <div className="mt-8 rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-lime-100/70">
              Limited spots
            </p>

            <p className="mt-3 text-4xl font-semibold tracking-tight text-lime-50">
              {event.remainingSpots}
            </p>

            <p className="mt-2 text-sm text-lime-100/62">
              Remaining from {event.capacity}
            </p>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-4">
            {event.ticketTiers.map(
              (tier: TicketTierData) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  selected={
                    tier.id === selectedTierId
                  }
                  onSelect={() =>
                    setSelectedTierId(tier.id)
                  }
                />
              )
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-lime-200/16 bg-black/45 p-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-lime-100/70">
                Selected tier
              </p>

              <p className="mt-2 text-lg font-medium text-lime-50">
                {selectedTier?.name ?? "—"}
              </p>

              <p className="mt-1 text-sm text-lime-100/62">
                {selectedTier?.price ?? ""}
              </p>
            </div>

            <Magnetic
              className="inline-block"
              strength={0.14}
            >
              <Button
                asChild
                variant="primary"
                size="roomy"
                endIcon={<ArrowRight size={16} />}
              >
                <Link
                  href={`/register/${event.eventKey}`}
                >
                  Reserve Your Spot
                </Link>
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}