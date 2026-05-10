"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionWrapper from "@/components/layout/section-wrapper";
import { founderExpansionSlots, founderProfiles } from "@/data/founderAssets";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Founders() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const atmosphereY = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".founder-rail",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.to(".founder-drift", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <SectionWrapper
      id="founders"
      spacing="relaxed"
      className="overflow-hidden border-y border-lime-200/10 bg-[#03101d]"
      innerClassName="relative"
      blendTop
      blendBottom
    >
      <section ref={sectionRef} className="relative">
        <motion.div
          style={{ y: atmosphereY }}
          className="pointer-events-none absolute -left-28 top-10 h-[34rem] w-[34rem] rounded-full bg-cyan-300/10 blur-3xl"
        />
        <div className="pointer-events-none absolute inset-x-0 top-32 h-px bg-gradient-to-r from-transparent via-lime-100/25 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.12 }}
          className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <motion.div variants={reveal} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-xs uppercase tracking-[0.38em] text-lime-100/45 md:text-sm">
              The Minds Behind The Nexus
            </p>
            <h2 className="mt-6 max-w-4xl text-[2.75rem] font-semibold leading-[0.96] tracking-[-0.04em] text-lime-50 sm:text-[4rem] md:text-[5.7rem]">
              Creating spaces people belong to.
            </h2>
          </motion.div>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl lg:justify-self-end"
          >
            <p className="text-base leading-relaxed text-lime-100/64 md:text-lg">
              The Nexus is founder-led by design: close enough to culture to feel the
              room, disciplined enough to build the systems around it, and ambitious
              enough to make every gathering feel cinematic.
            </p>
            <div className="founder-rail mt-8 h-px w-full bg-gradient-to-r from-cyan-300/80 via-lime-100/45 to-transparent" />
          </motion.div>
        </motion.div>

        <div className="relative mt-16 grid gap-6 lg:mt-24">
          {founderProfiles.map((founder, index) => (
            <motion.article
              key={founder.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.25 }}
              className={cn(
                "group relative grid min-h-[620px] overflow-hidden rounded-[2rem] border border-lime-200/14 bg-black/38 shadow-2xl shadow-cyan-950/20 md:min-h-[660px] lg:grid-cols-2",
                index % 2 === 1 && "lg:[&>div:first-child]:order-2",
              )}
            >
              <div className="relative flex min-h-[420px] items-end justify-center overflow-hidden bg-gradient-to-br from-lime-100/[0.08] via-cyan-300/[0.05] to-black/10 lg:min-h-full">
                <div
                  className={cn(
                    "absolute inset-6 rounded-[1.5rem] bg-gradient-to-br opacity-90 before:absolute before:inset-x-10 before:bottom-0 before:h-44 before:rounded-full before:blur-3xl",
                    founder.portraitStageClassName,
                  )}
                />
                <div className="absolute inset-x-8 bottom-0 h-1/2 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                <div className="founder-drift absolute inset-0">
                  <Image
                    src={founder.image}
                    alt={founder.imageAlt}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    priority={index === 0}
                    placeholder="blur"
                    className={cn(
                      "absolute z-10 drop-shadow-[0_28px_55px_rgba(0,0,0,0.5)] transition duration-700 group-hover:scale-[1.035]",
                      founder.imageClassName,
                    )}
                  />
                </div>
                <p className="absolute bottom-6 left-6 z-20 max-w-[15rem] text-[0.68rem] uppercase tracking-[0.28em] text-lime-50/50">
                  {founder.analysis.emotionalTone}
                </p>
              </div>

              <div className="relative flex flex-col justify-between p-7 sm:p-9 md:p-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/65">
                    {founder.role}
                  </p>
                  <h3 className="mt-5 font-serif text-4xl leading-none tracking-[-0.03em] text-lime-50 sm:text-5xl md:text-6xl">
                    {founder.name}
                  </h3>
                  <p className="mt-5 text-sm uppercase tracking-[0.22em] text-lime-100/42">
                    {founder.focus}
                  </p>
                  <p className="mt-8 max-w-xl text-xl leading-relaxed text-lime-50/78 md:text-2xl">
                    {founder.statement}
                  </p>
                </div>

                <div className="mt-12">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {founder.metrics.map((metric) => (
                      <div
                        key={metric}
                        className="border-t border-lime-100/16 pt-4 text-xs uppercase tracking-[0.2em] text-lime-100/48"
                      >
                        {metric}
                      </div>
                    ))}
                  </div>
                  <p className="mt-9 font-serif text-2xl italic tracking-[-0.02em] text-cyan-100/80">
                    {founder.signatureLine}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="mt-6 grid gap-3 sm:grid-cols-3"
        >
          {founderExpansionSlots.map((slot) => (
            <div
              key={slot}
              className="rounded-2xl border border-dashed border-lime-100/16 bg-lime-100/[0.025] p-5 text-xs uppercase tracking-[0.22em] text-lime-100/38"
            >
              Future founder asset system: {slot}
            </div>
          ))}
        </motion.div>
      </section>
    </SectionWrapper>
  );
}
