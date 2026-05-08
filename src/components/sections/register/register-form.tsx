"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import type { EventData } from "@/lib/events";
import TierCard from "@/components/sections/event-detail/registration/tier-card";

interface RegisterFormProps {
  event: EventData;
}

export default function RegisterForm({ event }: RegisterFormProps) {
  const baseId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [tierId, setTierId] = useState(event.ticketTiers[0]?.id ?? "");

  const selectedTier = useMemo(
    () => event.ticketTiers.find((tier) => tier.id === tierId),
    [event.ticketTiers, tierId],
  );

  const handleSubmit = (eventForm: React.FormEvent<HTMLFormElement>) => {
    eventForm.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionWrapper spacing="default" className="border-y border-lime-200/15 bg-black/45" blendTop blendBottom>
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <div className="grid gap-4">
            {event.ticketTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                selected={tier.id === tierId}
                onSelect={() => setTierId(tier.id)}
              />
            ))}
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="rounded-[2rem] border border-lime-200/16 bg-lime-200/[0.04] p-7 md:col-span-6 md:p-9"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-lime-100/50">
            Request details
          </p>
          <p className="mt-3 text-sm text-lime-100/65">
            Selected tier: <span className="text-lime-50">{selectedTier?.name}</span>
          </p>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">Full name</span>
              <input id={`${baseId}-name`} required className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25" />
            </label>
            <label className="grid gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">Email</span>
              <input id={`${baseId}-email`} type="email" required className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25" />
            </label>
            <label className="grid gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">Phone</span>
              <input id={`${baseId}-phone`} required className="h-11 rounded-2xl border border-lime-300/22 bg-black/40 px-4 text-lime-50 outline-none transition focus:border-lime-300/45 focus:ring-2 focus:ring-lime-300/25" />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.24em] text-lime-100/46">
              {submitted ? "Request submitted (demo)." : "Host team reviews each request."}
            </p>
            <Magnetic className="inline-block" strength={0.14}>
              <Button type="submit" variant="primary" size="roomy">
                {submitted ? "Submitted" : "Submit Request"}
              </Button>
            </Magnetic>
          </div>
        </motion.form>
      </div>
    </SectionWrapper>
  );
}

