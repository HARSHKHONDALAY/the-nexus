"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

interface HeroAtmosphereProps {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

export default function HeroAtmosphere({
  pointerX,
  pointerY,
}: HeroAtmosphereProps) {
  const prefersReducedMotion = useReducedMotion();

  const xMain = useSpring(useTransform(pointerX, (v) => v * 14), {
    stiffness: 140,
    damping: 22,
  });
  const yMain = useSpring(useTransform(pointerY, (v) => v * 10), {
    stiffness: 140,
    damping: 22,
  });
  const xLeft = useSpring(useTransform(pointerX, (v) => v * -5), {
    stiffness: 130,
    damping: 24,
  });
  const yLeft = useSpring(useTransform(pointerY, (v) => v * 4), {
    stiffness: 130,
    damping: 24,
  });
  const xRight = useSpring(useTransform(pointerX, (v) => v * 4), {
    stiffness: 130,
    damping: 24,
  });
  const yRight = useSpring(useTransform(pointerY, (v) => v * -3), {
    stiffness: 130,
    damping: 24,
  });

  return (
    <div className="absolute inset-0">
      {/* Ambient color field keeps the hero emotionally warm but restrained. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(145,255,98,0.22),transparent_42%),radial-gradient(circle_at_12%_18%,rgba(74,222,128,0.16),transparent_34%),radial-gradient(circle_at_86%_80%,rgba(134,239,172,0.14),transparent_40%)]" />

      {/* Soft central bloom: the cinematic light source for the composition. */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[30%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-lime-300/12 blur-[150px] md:h-[760px] md:w-[760px]"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [1, 1.05, 1],
                opacity: [0.58, 0.78, 0.58],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={prefersReducedMotion ? undefined : { x: xMain, y: yMain }}
      />

      {/* Edge lights add depth separation without introducing visual noise. */}
      <motion.div
        aria-hidden
        className="absolute -left-24 top-[8%] h-[300px] w-[300px] rounded-full bg-emerald-300/10 blur-[130px] md:h-[460px] md:w-[460px]"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, 16, 0],
                y: [0, -14, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={prefersReducedMotion ? undefined : { x: xLeft, y: yLeft }}
      />

      <motion.div
        aria-hidden
        className="absolute -bottom-28 right-[-4%] h-[320px] w-[320px] rounded-full bg-green-300/10 blur-[130px] md:h-[500px] md:w-[500px]"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, -18, 0],
                y: [0, 8, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={prefersReducedMotion ? undefined : { x: xRight, y: yRight }}
      />

      {/* Filmic texture + fades blend the hero into surrounding sections. */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#050806]/95 to-transparent md:h-64" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#050806]/50 to-[#050806]" />
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050806]/35 to-transparent md:w-32" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050806]/35 to-transparent md:w-32" />
    </div>
  );
}
