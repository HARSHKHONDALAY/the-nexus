import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/shared/button";
import { events } from "@/lib/events";

export default function HeroContent() {
  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  return (
    <div className="container-custom relative z-10 flex min-h-[100svh] items-end pb-24 pt-32 md:items-center md:pb-18 md:pt-36">
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.58fr)] lg:items-end">
        <div className="max-w-[56rem]">
          <div className="inline-flex items-center gap-3 rounded-full border border-lime-200/18 bg-lime-200/[0.055] px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-lime-100/70 backdrop-blur-2xl">
            <Sparkles size={14} className="text-lime-200" />
            Mumbai is gathering · {featuredEvent.title}
          </div>

          <h1 className="mt-7 max-w-[10.5ch] font-serif text-[2.75rem] leading-[0.92] tracking-[-0.055em] text-white sm:text-[3.85rem] md:mt-8 md:text-[5rem] lg:text-[6rem]">
            Find your kind of people.
          </h1>

          <p className="mt-6 max-w-[38rem] text-[1.02rem] leading-8 text-white/68 sm:text-[1.08rem] md:mt-7 md:text-[1.14rem]">
            The Nexus is a Mumbai-born cultural ecosystem of chess rooms, art
            tables, workshops, and intentional nights where strangers slowly
            become familiar faces.
          </p>

          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-white/54 sm:flex sm:flex-wrap">
            <span className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2">
              {featuredEvent.date}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2">
              From {featuredEvent.priceFrom}
            </span>
            <span className="col-span-2 rounded-full border border-lime-300/22 bg-lime-300/[0.08] px-4 py-2 text-lime-50">
              {featuredEvent.venue}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-4">
            <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
              <Link href={`/register/${featuredEvent.eventKey}`}>Buy Tickets</Link>
            </Button>

            <Button asChild variant="secondary" size="roomy">
              <Link href={`/events/${featuredEvent.slug}`}>Explore Event</Link>
            </Button>
          </div>
        </div>

        <aside className="hidden justify-self-end rounded-[2rem] border border-white/12 bg-black/28 p-5 text-left shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-2xl lg:block">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-lime-100/48">
            Room Note
          </p>
          <p className="mt-4 max-w-[24ch] text-[1.7rem] font-medium leading-[1.1] tracking-[-0.03em] text-lime-50">
            Come solo, leave with someone asking if you are coming next time.
          </p>
          <p className="mt-4 max-w-[28ch] text-[0.96rem] leading-7 text-lime-100/58">
            {featuredEvent.remainingSpots} seats remain in a room built for
            conversation, taste, and easy belonging.
          </p>
        </aside>
      </div>
    </div>
  );
}
