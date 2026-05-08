"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

import NexusParticleField from "@/components/sections/hero/particle-field-core";

export default function ParticleFieldCanvas() {
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const particleCount = prefersReducedMotion ? 360 : isCoarsePointer ? 540 : 1120;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 8], fov: 48 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <NexusParticleField
          key={particleCount}
          count={particleCount}
          interactive={!prefersReducedMotion && !isCoarsePointer}
          reducedMotion={Boolean(prefersReducedMotion)}
        />
      </Canvas>
    </div>
  );
}
