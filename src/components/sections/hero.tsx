"use client";

import ParticleFieldCanvas from "@/components/sections/hero/particle-field-canvas";
import HeroContent from "@/components/sections/hero/hero-content";

export default function Hero() {
  return (
    <section className="relative isolate z-10 min-h-screen overflow-hidden bg-[#030405]">
      <ParticleFieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_44%_36%,rgba(255,255,255,0.07),transparent_40%),radial-gradient(circle_at_66%_26%,rgba(113,136,255,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
      <HeroContent />
    </section>
  );
}