"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMotionValue, useReducedMotion } from "framer-motion";

import AtmosphericBackground from "@/components/sections/hero/atmospheric-background";
import HeroContent from "@/components/sections/hero/hero-content";
import { chessAssets } from "@/data/chessAssets";

const DigitalNetworkScene = dynamic(() => import("@/components/sections/hero/digital-network-scene"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const [renderNetwork, setRenderNetwork] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animations = Array.from(section.querySelectorAll<HTMLElement>(".hero-cinematic-layer")).map((element, index) =>
      element.animate(
        [
          { opacity: 0, filter: "blur(18px)", transform: "translateY(18px)" },
          { opacity: 1, filter: "blur(0px)", transform: "translateY(0)" },
        ],
        {
          duration: 1450,
          delay: index * 160,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      ),
    );

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight * 0.85, 1), 1);
      section.style.setProperty("--hero-scroll", String(progress));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (prefersReducedMotion) {
      section.style.setProperty("--hero-scroll", "0");
      return () => {
        window.removeEventListener("scroll", handleScroll);
        animations.forEach((animation) => animation.cancel());
      };
    }

    const timeoutId = globalThis.setTimeout(() => setRenderNetwork(true), 4500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      globalThis.clearTimeout(timeoutId);
      animations.forEach((animation) => animation.cancel());
    };
  }, [prefersReducedMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const heroImage = chessAssets?.heroImages?.[0];

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative isolate z-10 min-h-[100svh] overflow-hidden bg-[#020817] [--hero-scroll:0]"
    >
      <div className="hero-cinematic-layer absolute inset-0">
        <Image
          src={heroImage?.src ?? "/events/default-hero.jpg"}
          alt={heroImage?.alt ?? "The Nexus"}
          fill
          priority
          quality={75}
          sizes="100vw"
          className="scale-[1.03] object-cover opacity-72 saturate-[0.78] contrast-[1.05] transition-transform duration-[1800ms] ease-out [object-position:center]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,rgba(8,145,178,0.10),transparent_32%),linear-gradient(90deg,rgba(2,8,23,0.98)_0%,rgba(2,8,23,0.76)_30%,rgba(2,8,23,0.34)_56%,rgba(2,8,23,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.82),rgba(2,8,23,0.18)_28%,rgba(2,8,23,0.36)_62%,#020817_100%)]" />
      </div>
      <AtmosphericBackground pointerX={pointerX} pointerY={pointerY} />
      {renderNetwork && !prefersReducedMotion ? <DigitalNetworkScene pointerX={pointerX} pointerY={pointerY} /> : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,8,23,0.62),transparent_24%,transparent_58%,rgba(2,8,23,0.94))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[calc(var(--hero-scroll)*0.72)] backdrop-blur-[calc(var(--hero-scroll)*10px)]" />
      <HeroContent />
    </section>
  );
}
