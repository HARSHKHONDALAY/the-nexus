"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

type TicketTier = any;

interface TierCardProps {
  tier: TicketTier;
  selected: boolean;
  onSelect: () => void;
}

export default function TierCard({ tier, selected, onSelect }: TierCardProps) {
  const isSoldOut = tier.status === "sold_out";
  const isLimited = tier.status === "limited";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={isSoldOut}
      whileHover={isSoldOut ? undefined : { y: -3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group w-full rounded-[1.8rem] border p-7 text-left transition ${
        selected
          ? "border-lime-300/55 bg-lime-300/[0.12]"
          : "border-lime-200/16 bg-lime-200/[0.03] hover:border-lime-200/28 hover:bg-lime-200/[0.05]"
      } ${isSoldOut ? "cursor-not-allowed opacity-55" : ""}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lime-100/70">
            {tier.name}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-lime-50">
            {tier.price}
          </p>
          <p className="mt-3 text-lime-100/62">{tier.note}</p>
        </div>

        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-200/18 bg-black/40 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
              <Lock size={14} /> Sold out
            </span>
          ) : isLimited ? (
            <span className="rounded-full border border-lime-300/28 bg-lime-300/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-lime-50">
              Limited
            </span>
          ) : (
            <span className="rounded-full border border-lime-200/18 bg-black/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/55">
              Available
            </span>
          )}
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-3 text-sm text-lime-100/70">
            <Check size={16} className="mt-0.5 text-lime-200/70" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
    </motion.button>
  );
}
