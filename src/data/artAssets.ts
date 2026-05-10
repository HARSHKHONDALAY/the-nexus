import artCommunity from "@/assets/events/art-nexus/gallery/art-community-showcase.jpg";
import artFinishedWork from "@/assets/events/art-nexus/gallery/art-finished-work.jpg";
import artRoomEnergy from "@/assets/events/art-nexus/gallery/art-room-energy.jpg";
import artPortraitBlue from "@/assets/events/art-nexus/gallery/IMG_9438.jpg";
import artPortraitRed from "@/assets/events/art-nexus/gallery/IMG_9440.jpg";
import artTexturePortrait from "@/assets/events/art-nexus/gallery/IMG_5908.jpg";
import type { EventAssetSet, ImageAsset } from "@/data/eventAssetTypes";
import artProcess from "@/assets/events/art-nexus/gallery/art-table-process.jpg";
import artPoster from "@/assets/events/art-nexus/posters/art-nexus-texture-painting-poster.png";

const heroImages: ImageAsset[] = [
  {
    id: "art-hero-texture-wave",
    src: artCommunity,
    alt: "The Art Nexus community showcase visual",
    label: "Community Showcase",
    intent: "Strongest community art visual for immersive hero sections.",
    orientation: "landscape",
    aspectRatio: "2:1",
    width: 1920,
    height: 960,
    quality: "strong",
    suitability: ["hero", "landscape-gallery"],
  },
];

const galleryImages: ImageAsset[] = [
  {
    id: "art-community-showcase",
    src: artCommunity,
    alt: "The Art Nexus guests holding finished artworks inside the venue",
    label: "Finished Room",
    intent: "A complete creative-room payoff with faces, artworks, and venue texture.",
    orientation: "landscape",
    aspectRatio: "16:9",
    width: 5712,
    height: 3213,
    quality: "excellent",
    suitability: ["gallery", "landscape-gallery"],
    className: "md:col-span-7 md:row-span-2",
  },
  {
    id: "art-table-process",
    src: artProcess,
    alt: "Art materials and guests working through a creative session",
    label: "Process Table",
    intent: "Hands-on making, shared materials, and guided creative energy.",
    orientation: "landscape",
    aspectRatio: "4:3",
    width: 4032,
    height: 3024,
    quality: "strong",
    suitability: ["gallery", "landscape-gallery"],
    className: "md:col-span-5",
  },
  {
    id: "art-finished-work",
    src: artFinishedWork,
    alt: "Two Art Nexus guests smiling with a finished botanical artwork",
    label: "Expression",
    intent: "Human expression and a clear creative artifact.",
    orientation: "landscape",
    aspectRatio: "4:3",
    width: 5712,
    height: 4284,
    quality: "strong",
    suitability: ["gallery", "landscape-gallery"],
    className: "md:col-span-5",
  },
  {
    id: "art-room-energy",
    src: artRoomEnergy,
    alt: "The Art Nexus room with guests and completed canvas pieces",
    label: "Room Energy",
    intent: "Modern artistic energy and social completion.",
    orientation: "landscape",
    aspectRatio: "4:3",
    width: 5712,
    height: 4284,
    quality: "strong",
    suitability: ["gallery", "landscape-gallery"],
    className: "md:col-span-6",
  },
  {
    id: "art-blue-portrait",
    src: artPortraitBlue,
    alt: "Portrait artwork detail from The Art Nexus session",
    label: "Blue Study",
    intent: "Portrait-format artwork detail for masonry rhythm.",
    orientation: "portrait",
    aspectRatio: "9:16",
    width: 2268,
    height: 4032,
    quality: "strong",
    suitability: ["gallery", "portrait-gallery"],
    className: "md:col-span-3 md:row-span-2",
  },
  {
    id: "art-red-portrait",
    src: artPortraitRed,
    alt: "Red artwork detail from The Art Nexus session",
    label: "Red Study",
    intent: "Expressive vertical composition for immersive gallery contrast.",
    orientation: "portrait",
    aspectRatio: "9:16",
    width: 2268,
    height: 4032,
    quality: "strong",
    suitability: ["gallery", "portrait-gallery"],
    className: "md:col-span-3 md:row-span-2",
  },
  {
    id: "art-texture-portrait",
    src: artTexturePortrait,
    alt: "Portrait texture artwork from The Art Nexus",
    label: "Texture Detail",
    intent: "Close vertical texture for mobile-forward masonry.",
    orientation: "portrait",
    aspectRatio: "3:4",
    width: 4284,
    height: 5712,
    quality: "excellent",
    suitability: ["gallery", "portrait-gallery"],
    className: "md:col-span-6 md:row-span-2",
  },
];

const thumbnails: ImageAsset[] = [
  {
    id: "art-thumbnail-mark",
    src: artCommunity,
    alt: "The Art Nexus guests holding their completed artworks",
    label: "Art Community",
    intent: "Event card preview rooted in real creative energy and human expression.",
    orientation: "landscape",
    aspectRatio: "16:9",
    width: 5712,
    height: 3213,
    quality: "excellent",
    suitability: ["thumbnail"],
  },
];

const posters: ImageAsset[] = [
  {
    id: "art-may-poster",
    src: artPoster,
    alt: "The Art Nexus 16 May 2026 event poster",
    label: "16 May Poster",
    intent: "Promotional poster for ticketing and event context.",
    orientation: "portrait",
    aspectRatio: "4:5",
    width: 3375,
    height: 4219,
    quality: "excellent",
    suitability: ["poster"],
  },
];

export const artAssets: EventAssetSet = {
  world: "The Art Nexus",
  tone: ["creativity", "expression", "immersive visuals", "modern artistic energy", "gallery aesthetics"],
  heroImages,
  galleryImages,
  portraitGallery: galleryImages.filter((asset) => asset.orientation === "portrait"),
  landscapeGallery: galleryImages.filter((asset) => asset.orientation === "landscape"),
  videos: [
    {
      id: "art-process-mov-5799",
      sourcePath: "src/assets/events/art-nexus/videos/IMG_5799.mov",
      label: "Art Process Clip",
      orientation: "portrait",
      filesize: "14 MB",
      usability: "needs-transcode",
      mobileStrategy: "avoid",
    },
    {
      id: "art-room-mov-5802",
      sourcePath: "src/assets/events/art-nexus/videos/IMG_5802.mov",
      label: "Art Room Clip",
      orientation: "landscape",
      filesize: "39 MB",
      usability: "needs-transcode",
      mobileStrategy: "avoid",
    },
  ],
  thumbnails,
  posters,
};
