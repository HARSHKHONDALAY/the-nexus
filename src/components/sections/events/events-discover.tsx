"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import SectionWrapper from "@/components/layout/section-wrapper";
import EventCard from "@/components/sections/events/event-card";
type EventData = any;

type WorldFilter = "all" | "The Chess Nexus" | "The Art Nexus";
type TimeFilter = "all" | "this-month" | "next-month";

interface EventsDiscoverProps {
  events: EventData[];
}

function monthKey(dateISO: string) {
  const date = new Date(dateISO);
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

export default function EventsDiscover({ events }: EventsDiscoverProps) {
  const [worldFilter, setWorldFilter] = useState<WorldFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const now = new Date();
  const thisMonthKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}`;
  const nextMonthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const nextMonthKey = `${nextMonthDate.getUTCFullYear()}-${nextMonthDate.getUTCMonth()}`;

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const worldMatch = worldFilter === "all" || event.world === worldFilter;
        const eventMonth = monthKey(event.dateISO);
        const timeMatch =
          timeFilter === "all" ||
          (timeFilter === "this-month" && eventMonth === thisMonthKey) ||
          (timeFilter === "next-month" && eventMonth === nextMonthKey);
        return worldMatch && timeMatch;
      }),
    [events, worldFilter, timeFilter, thisMonthKey, nextMonthKey],
  );

  return (
    <SectionWrapper spacing="default">
      <div className="mb-10 flex flex-wrap items-center gap-3 md:mb-12">
        {(["all", "The Chess Nexus", "The Art Nexus"] as WorldFilter[]).map((world) => (
          <button
            key={world}
            onClick={() => setWorldFilter(world)}
            className={`rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] transition ${
              worldFilter === world
                ? "border-lime-300/52 bg-lime-300/18 text-lime-50"
                : "border-lime-300/24 bg-transparent text-lime-100/62 hover:border-lime-300/42 hover:text-lime-100"
            }`}
          >
            {world === "all" ? "All Worlds" : world}
          </button>
        ))}

        <div className="mx-2 hidden h-4 w-px bg-lime-200/20 md:block" />

        {(["all", "this-month", "next-month"] as TimeFilter[]).map((time) => (
          <button
            key={time}
            onClick={() => setTimeFilter(time)}
            className={`rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] transition ${
              timeFilter === time
                ? "border-lime-300/52 bg-lime-300/18 text-lime-50"
                : "border-lime-300/24 bg-transparent text-lime-100/62 hover:border-lime-300/42 hover:text-lime-100"
            }`}
          >
            {time.replace("-", " ")}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => (
          <motion.div key={event.slug} layout transition={{ duration: 0.35 }}>
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>

      {filteredEvents.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-lime-200/16 bg-lime-200/[0.04] p-6 text-sm leading-7 text-lime-100/62">
          No experiences match these filters yet. Reset the filters or check the next release wave.
        </div>
      ) : null}
    </SectionWrapper>
  );
}
