"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Magnetic from "@/components/interactions/magnetic";
import SectionWrapper from "@/components/layout/section-wrapper";
import SectionHeading from "@/components/shared/section-heading";
import { Button } from "@/components/shared/button";
import { getFeaturedEvents } from "@/lib/api/events";
import { mapPlatformEventsToEventData } from "@/lib/api/event-mappers";

type EventData = any;

export default function FeaturedExperiences() {
  const [featuredExperiences, setFeaturedExperiences] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const events =
          await getFeaturedEvents();

        const mappedEvents =
          mapPlatformEventsToEventData(
            events
          );

        setFeaturedExperiences(
          mappedEvents
        );
      } catch (error) {
        console.error(
          "Failed to load featured experiences:",
          error
        );

        setFeaturedExperiences([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <SectionWrapper
        id="featured-experiences"
        className="border-y border-lime-200/12 bg-black/40"
        spacing="default"
        blendTop
        blendBottom
      >
        <SectionHeading
          eyebrow="Rooms Inside The Nexus"
          title="Choose the energy you want to belong to."
          description="Chess for the socially strategic. Art for the emotionally open. Every format is limited, hosted, and designed to make coming alone feel completely natural."
        />

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {[1, 2, 3].map(
            (i: number) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl bg-lime-200/10"
              />
            )
          )}
        </div>
      </SectionWrapper>
    );
  }

  if (
    featuredExperiences.length === 0
  ) {
    return (
      <SectionWrapper
        id="featured-experiences"
        className="border-y border-lime-200/12 bg-black/40"
        spacing="default"
        blendTop
        blendBottom
      >
        <SectionHeading
          eyebrow="Rooms Inside The Nexus"
          title="Choose the energy you want to belong to."
          description="Chess for the socially strategic. Art for the emotionally open. Every format is limited, hosted, and designed to make coming alone feel completely natural."
        />

        <div className="mt-12 text-center text-lime-100/60">
          <p>
            No events available at the
            moment. Check back soon!
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="featured-experiences"
      className="border-y border-lime-200/12 bg-black/40"
      spacing="default"
      blendTop
      blendBottom
    >
      <SectionHeading
        eyebrow="Rooms Inside The Nexus"
        title="Choose the energy you want to belong to."
        description="Chess for the socially strategic. Art for the emotionally open. Every format is limited, hosted, and designed to make coming alone feel completely natural."
      />

      <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
        {featuredExperiences.map(
          (
            item: any,
            index: number
          ) => {
            const thumbnail = {
              src: "/events/default-thumbnail.jpg",
              alt:
                item.title || "Event",
            };

            return (
              <motion.article
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.85,
                  delay:
                    index * 0.08,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                className="group overflow-hidden rounded-3xl border border-lime-200/16 bg-black/35 shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition-colors duration-500 hover:border-lime-200/28"
              >
                <div className="relative h-56 overflow-hidden md:h-64">
                  <Image
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center opacity-90 transition duration-1000 group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/85" />

                  <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:240%_100%] bg-[position:100%_0] group-hover:bg-[position:0_0]" />
                </div>

                <div className="p-6 md:p-7">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-lime-100/48">
                    {item.date} ·{" "}
                    {item.city}
                  </p>

                  <h3 className="mt-4 text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.03em] text-lime-50">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[0.98rem] leading-7 text-lime-100/62">
                    {item.tagline}
                  </p>

                  <p className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-lime-100/45">
                    {
                      item.remainingSpots
                    }{" "}
                    spots left · from{" "}
                    {
                      item.priceFrom
                    }
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Magnetic
                      className="inline-block"
                      strength={0.12}
                    >
                      <Button
                        asChild
                        variant="primary"
                        size="compact"
                        endIcon={
                          <ArrowRight
                            size={14}
                          />
                        }
                      >
                        <Link
                          href={`/register/${item.eventKey}`}
                        >
                          Book Tickets
                        </Link>
                      </Button>
                    </Magnetic>

                    <Button
                      asChild
                      variant="ghost"
                      size="compact"
                      className="border border-lime-300/16 px-4 text-[0.67rem] tracking-[0.16em] hover:border-lime-300/34 hover:bg-lime-300/[0.08]"
                      endIcon={
                        <ArrowUpRight
                          size={14}
                        />
                      }
                    >
                      <Link
                        href={`/events/${item.slug}`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          }
        )}
      </div>
    </SectionWrapper>
  );
}