import type { StaticImageData } from "next/image";

export type MediaOrientation = "landscape" | "portrait" | "square";

export type MediaIntent =
  | "hero"
  | "gallery"
  | "portrait-gallery"
  | "landscape-gallery"
  | "thumbnail"
  | "poster"
  | "video";

export interface ImageAsset {
  id: string;

  // Supports both imported Next.js images
  // and runtime string URLs from backend/API
  src: string | StaticImageData;

  alt: string;

  label: string;

  intent: string;

  orientation: MediaOrientation;

  aspectRatio: string;

  width: number;

  height: number;

  quality: "excellent" | "strong" | "usable";

  suitability: MediaIntent[];

  className?: string;
}

export interface VideoAsset {
  id: string;

  // Optional runtime/public URL
  src?: string;

  // Original local/source reference
  sourcePath: string;

  label: string;

  orientation: MediaOrientation;

  filesize: string;

  usability:
    | "background"
    | "supporting"
    | "needs-transcode";

  mobileStrategy:
    | "avoid"
    | "metadata-only"
    | "safe";
}

export interface EventAssetSet {
  world: "The Chess Nexus" | "The Art Nexus";

  tone: string[];

  heroImages: ImageAsset[];

  galleryImages: ImageAsset[];

  portraitGallery: ImageAsset[];

  landscapeGallery: ImageAsset[];

  videos: VideoAsset[];

  thumbnails: ImageAsset[];

  posters: ImageAsset[];
}