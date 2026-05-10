import type { StaticImageData } from "next/image";

import harshPortrait from "@/founders/harsh/WhatsApp Image 2026-05-09 at 17.30.02.png";
import khushalPortrait from "@/founders/khushal/WhatsApp Image 2026-05-09 at 17.17.19.png";

export type FounderAssetProfile = {
  orientation: "portrait";
  framing: string;
  composition: string;
  backgroundQuality: string;
  emotionalTone: string;
  visualHierarchy: string;
};

export type FounderProfile = {
  name: string;
  role: string;
  image: StaticImageData;
  imageAlt: string;
  focus: string;
  statement: string;
  signatureLine: string;
  analysis: FounderAssetProfile;
  imageClassName: string;
  portraitStageClassName: string;
  metrics: string[];
};

export const founderProfiles: FounderProfile[] = [
  {
    name: "Harsh Khondalay",
    role: "Co-Founder",
    image: harshPortrait,
    imageAlt: "Harsh Khondalay, co-founder of The Nexus",
    focus: "Systems, identity, and digital culture",
    statement:
      "Building The Nexus as a premium culture engine where technology, design, and community energy move together.",
    signatureLine: "Architecting the experience layer.",
    analysis: {
      orientation: "portrait",
      framing: "Tight upper-body cutout with a confident three-quarter stance.",
      composition:
        "Asymmetric body angle, warm face lighting, and dark wardrobe create a strong editorial anchor.",
      backgroundQuality:
        "Transparent cutout with no environmental background, best suited to a designed cinematic stage.",
      emotionalTone: "Calm, composed, ambitious, and slightly understated.",
      visualHierarchy:
        "Face and leather texture lead first, then the posture and hands add founder-led confidence.",
    },
    imageClassName:
      "bottom-0 left-1/2 h-[86%] w-auto -translate-x-[45%] object-contain md:h-[92%]",
    portraitStageClassName:
      "from-cyan-300/18 via-lime-100/8 to-black/0 before:bg-cyan-300/18",
    metrics: ["Digital systems", "Experience strategy", "Premium ecosystems"],
  },
  {
    name: "Khushal Nile",
    role: "Co-Founder",
    image: khushalPortrait,
    imageAlt: "Khushal Nile, co-founder of The Nexus",
    focus: "Operations, growth, and community architecture",
    statement:
      "Shaping the operational rhythm behind cultural rooms that feel polished, intentional, and genuinely social.",
    signatureLine: "Turning moments into momentum.",
    analysis: {
      orientation: "portrait",
      framing: "Tall full-body cutout with generous headroom and formal styling.",
      composition:
        "Centered, upright, and approachable with bright wardrobe contrast against darker interface layers.",
      backgroundQuality:
        "Transparent cutout with extra vertical space, ideal for parallax and layered depth.",
      emotionalTone: "Open, optimistic, refined, and community-facing.",
      visualHierarchy:
        "Smile and light blazer read first, then the full vertical silhouette gives scale and presence.",
    },
    imageClassName:
      "bottom-0 left-1/2 h-[96%] w-auto -translate-x-1/2 object-contain md:h-[104%]",
    portraitStageClassName:
      "from-lime-100/18 via-cyan-300/10 to-black/0 before:bg-lime-100/16",
    metrics: ["Community systems", "Growth design", "Event operations"],
  },
];

export const founderExpansionSlots = [
  "Creative direction",
  "Production design",
  "Partnerships",
];
