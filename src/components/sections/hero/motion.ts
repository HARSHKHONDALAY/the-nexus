import type { Transition } from "framer-motion";

export const cinematicEase = [0.22, 1, 0.36, 1] as const;

export const heroEntrance: Transition = {
  duration: 1.15,
  ease: cinematicEase,
};

export const heroDelayed = (delay: number): Transition => ({
  ...heroEntrance,
  delay,
});
