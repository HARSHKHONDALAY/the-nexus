"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Magnetic from "@/components/interactions/magnetic";
import { Button } from "@/components/shared/button";

interface WorldPortalCardProps {
  title: string;
  mood: string;
  description: string;
  atmosphere: string;
}

export default function WorldPortalCard({
  title,
  mood,
  description,
  atmosphere,
}: WorldPortalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.5 });
  const smoothY = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.5 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * 5);
    rotateX.set((0.5 - y) * 5);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group relative overflow-hidden rounded-[2rem] border border-lime-200/18 bg-black/35 p-8 backdrop-blur-xl md:p-10"
    >
      <div className={`pointer-events-none absolute inset-0 ${atmosphere}`} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lime-200/[0.05] to-black/25 opacity-70" />

      <div style={{ transform: "translateZ(28px)" }} className="relative z-10">
        <p className="text-xs uppercase tracking-[0.35em] text-lime-100/48">{mood}</p>
        <h3 className="mt-5 text-3xl font-semibold tracking-tight text-lime-50 md:text-4xl">{title}</h3>
        <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-lime-100/62 md:text-lg">
          {description}
        </p>

        <Magnetic className="mt-8 inline-block" strength={0.13}>
          <Button
            variant="ghost"
            className="px-0 text-xs uppercase tracking-[0.26em] text-white/75 hover:bg-transparent"
            endIcon={<ArrowRight size={14} />}
          >
            Enter World
          </Button>
        </Magnetic>
      </div>
    </motion.article>
  );
}
