"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

interface AtmosphericBackgroundProps {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

export default function AtmosphericBackground({
  pointerX,
  pointerY,
}: AtmosphericBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const driftX = useSpring(useTransform(pointerX, (value) => value * 34), {
    stiffness: 90,
    damping: 26,
  });
  const driftY = useSpring(useTransform(pointerY, (value) => value * 24), {
    stiffness: 90,
    damping: 26,
  });
  const reverseX = useSpring(useTransform(pointerX, (value) => value * -22), {
    stiffness: 80,
    damping: 28,
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_30%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_76%_28%,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_18%_72%,rgba(99,102,241,0.14),transparent_36%),linear-gradient(135deg,#020817_0%,#06142d_48%,#01030a_100%)]" />

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[26%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-300/12 blur-[150px] md:h-[780px] md:w-[780px]"
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.45, 0.68, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={prefersReducedMotion ? undefined : { x: driftX, y: driftY }}
      />

      <motion.div
        aria-hidden
        className="absolute -right-32 top-12 h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-[130px] md:h-[620px] md:w-[620px]"
        animate={prefersReducedMotion ? undefined : { y: [0, 18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        style={prefersReducedMotion ? undefined : { x: reverseX }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_0%,rgba(255,255,255,0.045)_45%,transparent_62%)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_0%,transparent_42%,rgba(0,0,0,0.76)_100%)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:92px_92px]" />
    </div>
  );
}
