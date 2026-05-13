"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Camera, Sparkles } from "lucide-react";

import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";
import { artAssets } from "@/data/artAssets";
import { chessAssets } from "@/data/chessAssets";
import type { ImageAsset } from "@/data/eventAssetTypes";
type EventData = any;
import defaultOgImage from "@/../public/branding/og-image.png";

interface MomentsExperienceProps {
  featuredEvent: EventData;
}

const reveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(14px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const storyBlocks = [
  {
    eyebrow: "The Silence Before Checkmate",
    title: "A room can go quiet and still feel electric.",
    body: "The board becomes a stage. Every glass, glance, and pause carries the pressure of a move nobody wants to waste.",
    image: chessAssets.portraitGallery[0],
  },
  {
    eyebrow: "Where Strangers Became Rivals",
    title: "The best nights make competition feel like belonging.",
    body: "People arrive alone, lean into the same table, and leave with names they will remember the next time the room opens.",
    image: chessAssets.landscapeGallery[0],
  },
  {
    eyebrow: "Art Beyond The Canvas",
    title: "Creativity becomes social when the room is built with care.",
    body: "Texture, color, conversation, and finished work turn into a shared proof: everyone made something, and the room made everyone softer.",
    image: artAssets.galleryImages[0],
  },
];

const archiveNotes = [
  "Quiet tension at the table.",
  "The social moment after the move.",
  "Finished work held with pride.",
];

gsap.registerPlugin(ScrollTrigger);

function MomentsImage({
  asset,
  priority = false,
  sizes,
  className = "",
}: {
  asset: ImageAsset;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const image = asset?.src ?? defaultOgImage;

  return (
    <Image
      src={image}
      alt={asset?.alt ?? "Nexus visual moment placeholder"}
      fill
      priority={priority}
      quality={75}
      sizes={sizes}
      
      className={`object-cover ${className}`}
    />
  );
}

function MomentFrame({
  asset,
  index,
  className = "",
}: {
  asset: ImageAsset;
  index: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.22 }}
      className={`group relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.24)] ${className}`}
    >
      <MomentsImage
        asset={asset}
        sizes={asset?.orientation === "portrait" ? "(max-width: 768px) 92vw, 28vw" : "(max-width: 768px) 92vw, 44vw"}
        className="transition duration-[1400ms] ease-out group-hover:scale-[1.055]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/12 to-black/84" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-cyan-100/72">{asset?.label ?? "Untitled Moment"}</p>
        <p className="mt-2 max-w-sm text-[0.92rem] leading-6 text-white/68">{asset?.intent ?? "Captured energy and atmosphere from The Nexus."}</p>
      </div>
    </motion.article>
  );
}

export default function MomentsExperience({ featuredEvent }: MomentsExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImage = chessAssets.heroImages[0];
  const artHero = artAssets.heroImages[0];
  const chessVideo = chessAssets.videos.find((video) => video.usability === "background" && video.src);

  const featuredMoments = useMemo(
    () => [
      chessAssets.landscapeGallery[1],
      artAssets.galleryImages[0],
      chessAssets.portraitGallery[1],
      artAssets.landscapeGallery[1],
    ],
    [],
  );

  const masonryMoments = useMemo(
    () => [
      chessAssets.landscapeGallery[0],
      artAssets.portraitGallery[2],
      chessAssets.portraitGallery[0],
      artAssets.landscapeGallery[2],
      chessAssets.landscapeGallery[2],
      artAssets.portraitGallery[0],
      chessAssets.landscapeGallery[1],
      artAssets.landscapeGallery[1],
      artAssets.portraitGallery[1],
      chessAssets.portraitGallery[1],
    ],
    [],
  );

  const collageMoments = useMemo(
    () => [
      chessAssets.landscapeGallery[1],
      artAssets.galleryImages[0],
      chessAssets.landscapeGallery[2],
      artAssets.galleryImages[2],
      chessAssets.portraitGallery[0],
    ],
    [],
  );

  const finalArchiveImage = artAssets.landscapeGallery[0] ?? artHero;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -44]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to(".moments-drift", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      gsap.fromTo(
        ".moments-word",
        { opacity: 0, y: 22, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.08, ease: "power3.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative overflow-hidden bg-[#020617]">
      <section ref={heroRef} className="relative isolate min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0">
          <MomentsImage asset={heroImage} priority sizes="100vw" className="opacity-74 saturate-[0.82] contrast-[1.04]" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.97),rgba(2,6,23,0.66)_42%,rgba(2,6,23,0.8)),linear-gradient(to_bottom,rgba(0,0,0,0.82),transparent_32%,#020617_100%)]" />
        <div className="moments-drift pointer-events-none absolute right-[-8vw] top-24 hidden h-[48vh] w-[38vw] overflow-hidden rounded-[2rem] border border-white/10 opacity-50 xl:block">
          <MomentsImage asset={artHero} sizes="42vw" className="saturate-[0.9]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        </div>

        <motion.div style={{ y: headlineY }} className="container-custom relative z-10 flex min-h-[100svh] items-end pb-24 pt-34 md:items-center md:pb-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12, delayChildren: 0.2 }} className="max-w-[56rem]">
            <motion.div variants={reveal} className="inline-flex items-center gap-3 rounded-full border border-cyan-100/18 bg-cyan-100/[0.055] px-4 py-2 text-[0.64rem] uppercase tracking-[0.2em] text-cyan-50/72 backdrop-blur-2xl">
              <Camera size={14} />
              Culture archive · real rooms only
            </motion.div>
            <h1 className="mt-7 max-w-[9.2ch] font-serif text-[3.05rem] leading-[0.9] tracking-[-0.055em] text-white sm:text-[4.45rem] md:text-[5.9rem] lg:text-[7.2rem]">
              {"You had to be there.".split(" ").map((word) => (
                <span key={word} className="moments-word mr-4 inline-block">{word}</span>
              ))}
            </h1>
            <motion.p variants={reveal} className="mt-6 max-w-[38rem] text-[1rem] leading-7 text-white/68 md:text-[1.18rem]">
              Moments from The Nexus feel less like content and more like evidence:
              pressure, joy, expression, and people finding a room that finally matches their energy.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <Magnetic className="inline-block" strength={0.16}>
                <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                  <Link href={`/register/${featuredEvent.eventKey}`}>Be Part Of The Next Moment</Link>
                </Button>
              </Magnetic>
              <Button asChild variant="secondary" size="roomy">
                <Link href="/events">Explore Events</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative border-y border-white/10 bg-black/42 py-18 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/50">Featured Moments</p>
              <h2 className="mt-4 max-w-3xl text-[2.2rem] font-semibold leading-[1] tracking-[-0.04em] text-white md:text-[3.6rem]">
                The frames that make the night feel impossible to fake.
              </h2>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-7 text-white/52">
              Selected for faces, pressure, room texture, and emotional proof.
            </p>
          </div>

          <div className="grid auto-rows-[260px] gap-4 md:auto-rows-[310px] md:grid-cols-12 md:gap-5">
            {featuredMoments.map((asset, index) => (
              <MomentFrame
                key={asset?.id ?? `moment-${index}`}
                asset={asset}
                index={index}
                className={
                  index === 0
                    ? "md:col-span-7 md:row-span-2"
                    : index === 1
                      ? "md:col-span-5"
                      : index === 2
                        ? "md:col-span-3 md:row-span-2"
                        : "md:col-span-9"
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-30">
        <div className="container-custom space-y-20 md:space-y-28">
          {storyBlocks.map((story, index) => (
            <motion.article
              key={story.eyebrow}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.35 }}
              className={`grid gap-8 lg:grid-cols-12 lg:items-center ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/50">{story.eyebrow}</p>
                <h2 className="mt-4 text-[2.15rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-[3.5rem]">{story.title}</h2>
                <p className="mt-5 text-[0.98rem] leading-7 text-white/62 md:text-[1.05rem]">{story.body}</p>
              </div>
              <div className="relative h-[54vh] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] lg:col-span-7">
                <MomentsImage asset={story.image} sizes="(max-width: 1024px) 92vw, 58vw" className="saturate-[0.92] transition duration-[1400ms] hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/70" />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {chessVideo?.src ? (
        <section className="relative min-h-[76vh] overflow-hidden border-y border-cyan-100/10 bg-black">
          <video
  className="absolute inset-0 hidden h-full w-full object-cover opacity-62 saturate-[0.8] md:block"
  src={chessVideo.src}
  poster={typeof heroImage.src === "string" ? heroImage.src : heroImage.src.src}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
/>
          <MomentsImage asset={heroImage} sizes="100vw" className="md:hidden opacity-64" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.38)_55%,rgba(0,0,0,0.82)),linear-gradient(to_top,#020617,transparent_44%,#020617)]" />
          <div className="container-custom relative z-10 flex min-h-[76vh] items-end py-16 md:items-center md:py-24">
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true, amount: 0.4 }} className="max-w-3xl">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/58">Cinematic Pulse</p>
              <h2 className="mt-4 text-[2.4rem] font-semibold leading-[1] tracking-[-0.04em] text-white md:text-[4.5rem]">
                The room moves even when nobody says a word.
              </h2>
              <p className="mt-5 text-[1rem] leading-7 text-white/64 md:text-[1.05rem]">
                Video stays ambient, restrained, and textured: enough motion to feel alive,
                never so much that it steals the memory from the people inside it.
              </p>
            </motion.div>
          </div>
        </section>
      ) : null}

      <section className="relative bg-black/45 py-18 md:py-28">
        <div className="container-custom">
          <div className="mb-12 max-w-[44rem]">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/50">Living Archive</p>
            <h2 className="mt-4 text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-[3.7rem]">
              Portraits, proof, pressure, paint, and the aftermath.
            </h2>
            <p className="mt-5 text-[0.98rem] leading-7 text-white/58">
              A calmer editorial grid with more breathing room, more human signal, and less brand repetition.
            </p>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {masonryMoments.map((asset, index) => (
              <motion.figure
                key={`${asset?.id ?? "moment"}-${index}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                className="group mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-[0_22px_70px_rgba(0,0,0,0.2)]"
              >
                <div className={`relative ${asset?.orientation === "portrait" ? "aspect-[3/4]" : asset?.orientation === "square" ? "aspect-square" : "aspect-[16/10]"}`}>
                  <MomentsImage
                    asset={asset}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                    className="transition duration-[1400ms] ease-out group-hover:scale-[1.04] group-hover:brightness-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/8 to-black/84 opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.64rem] uppercase tracking-[0.2em] text-white/72">{archiveNotes[index % archiveNotes.length]}</p>
                  </div>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(103,232,249,0.12),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(14,165,233,0.12),transparent_30%)]" />
        <div className="container-custom relative">
          <div className="grid gap-10 lg:grid-cols-[0.52fr_0.92fr] lg:items-center">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100/52">Community Energy</p>
              <h2 className="mt-4 text-[2.4rem] font-semibold leading-[1] tracking-[-0.04em] text-white md:text-[4.2rem]">
                Culture is the part that keeps moving after the event ends.
              </h2>
              <p className="mt-5 text-[1rem] leading-7 text-white/62 md:text-[1.05rem]">
                The archive is not nostalgia. It is momentum. Every room becomes a
                signal for the next person deciding whether to show up.
              </p>
            </div>
            <div className="relative min-h-[640px] lg:min-h-[680px]">
              {collageMoments.map((asset, index) => (
                <motion.div
                  key={asset?.id ?? `collage-${index}`}
                  initial={{ opacity: 0, y: 40, rotate: index % 2 ? 3 : -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }}
                  transition={{ duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={`absolute overflow-hidden rounded-[1.45rem] border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
                    index === 0 ? "left-0 top-10 h-56 w-[64%]" :
                    index === 1 ? "right-0 top-0 h-72 w-[44%]" :
                    index === 2 ? "left-[14%] top-[40%] h-60 w-[56%]" :
                    index === 3 ? "right-[2%] top-[50%] h-52 w-[42%]" :
                    "bottom-0 left-[28%] h-72 w-[40%]"
                  }`}
                >
                  <MomentsImage asset={asset} sizes="(max-width: 1024px) 60vw, 34vw" className="transition duration-[1400ms] hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/58" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <MomentsImage asset={finalArchiveImage} sizes="100vw" className="opacity-72 saturate-[0.9]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96),rgba(2,6,23,0.58),rgba(2,6,23,0.96)),linear-gradient(to_bottom,#020617,transparent_34%,#020617)]" />
        <div className="container-custom relative z-10 flex min-h-[78vh] items-center justify-center py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true, amount: 0.45 }} className="max-w-4xl">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-cyan-100/18 bg-cyan-100/[0.055] px-4 py-2 text-[0.64rem] uppercase tracking-[0.2em] text-cyan-50/72 backdrop-blur-2xl">
              <Sparkles size={14} />
              The next archive starts soon
            </div>
            <h2 className="mt-6 font-serif text-[2.9rem] leading-[0.92] tracking-[-0.05em] text-white md:text-[5rem]">
              Be part of the next moment.
            </h2>
            <p className="mx-auto mt-5 max-w-[34rem] text-[1rem] leading-7 text-white/66 md:text-[1.05rem]">
              The best way to understand The Nexus is to step inside before the story becomes a photograph.
            </p>
            <div className="mt-9 flex justify-center">
              <Magnetic className="inline-block" strength={0.16}>
                <Button asChild variant="primary" size="roomy" endIcon={<ArrowRight size={16} />}>
                  <Link href={`/register/${featuredEvent.eventKey}`}>Book The Next Room</Link>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
