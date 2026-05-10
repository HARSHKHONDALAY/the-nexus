"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

export default function GlobalAtmosphere() {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const lightX = useSpring(pointerX, {
    damping: 30,
    stiffness: 140,
    mass: 0.6,
  });
  const lightY = useSpring(pointerY, {
    damping: 30,
    stiffness: 140,
    mass: 0.6,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      nextX = (event.clientX - viewportCenterX) * 0.06;
      nextY = (event.clientY - viewportCenterY) * 0.05;

      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        pointerX.set(nextX);
        pointerY.set(nextY);
        rafId = 0;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pointerX, pointerY, prefersReducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        aria-hidden
        style={{ x: lightX, y: lightY }}
        className="absolute left-1/2 top-[28%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-lime-300/[0.13] blur-[150px] md:h-[760px] md:w-[760px]"
      />
      <div className="absolute -left-28 top-24 h-[420px] w-[420px] rounded-full bg-emerald-300/[0.07] blur-[140px]" />
      <div className="absolute bottom-[-240px] right-[-100px] h-[460px] w-[460px] rounded-full bg-green-300/[0.08] blur-[150px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/55 via-transparent to-[#020817]/80" />
    </div>
  );
}
