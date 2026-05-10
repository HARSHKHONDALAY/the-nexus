import { artAssets } from "@/data/artAssets";
import { chessAssets } from "@/data/chessAssets";

import type {
  EventAssetSet,
  ImageAsset,
  VideoAsset,
} from "@/data/eventAssetTypes";

import type { EventData } from "@/lib/events";

export type {
  EventAssetSet,
  ImageAsset,
  VideoAsset,
};

const FALLBACK_IMAGE: ImageAsset = {
  id: "fallback-image",

  src: "/events/default-thumbnail.jpg",

  alt: "The Nexus Event",

  label: "Fallback Image",

  intent: "thumbnail",

  orientation: "landscape",

  aspectRatio: "16/9",

  width: 1920,

  height: 1080,

  quality: "usable",

  suitability: [
    "thumbnail",
    "gallery",
    "hero",
  ],
};

const FALLBACK_ASSET_SET: EventAssetSet = {
  world: "The Chess Nexus",

  tone: ["fallback"],

  heroImages: [FALLBACK_IMAGE],

  galleryImages: [FALLBACK_IMAGE],

  portraitGallery: [],

  landscapeGallery: [FALLBACK_IMAGE],

  videos: [],

  thumbnails: [FALLBACK_IMAGE],

  posters: [FALLBACK_IMAGE],
};

export const eventAssetSets: Partial<
  Record<EventData["world"], EventAssetSet>
> = {
  "The Chess Nexus": chessAssets,

  "The Art Nexus": artAssets,
};

export function getEventMedia(
  event: EventData,
): EventAssetSet {
  if (!event?.world) {
    return FALLBACK_ASSET_SET;
  }

  return (
    eventAssetSets[event.world] ??
    FALLBACK_ASSET_SET
  );
}

export function getPrimaryHeroImage(
  event: EventData,
): ImageAsset {
  const media = getEventMedia(event);

  return (
    media?.heroImages?.[0] ??
    media?.thumbnails?.[0] ??
    FALLBACK_IMAGE
  );
}

export function getPrimaryThumbnail(
  event: EventData,
): ImageAsset {
  const media = getEventMedia(event);

  return (
    media?.thumbnails?.[0] ??
    media?.heroImages?.[0] ??
    FALLBACK_IMAGE
  );
}

export function getEventCardImage(
  event: EventData,
): ImageAsset {
  const media = getEventMedia(event);

  if (event?.slug === "checkmate-chaos") {
    return (
      media?.galleryImages?.find(
        (asset) =>
          asset.id ===
          "chess-community-proof",
      ) ??
      media?.galleryImages?.[0] ??
      getPrimaryThumbnail(event)
    );
  }

  if (event?.slug === "chess-social-night") {
    return (
      media?.galleryImages?.find(
        (asset) =>
          asset.id ===
          "chess-main-floor",
      ) ??
      media?.galleryImages?.find(
        (asset) =>
          asset.id ===
          "chess-social-signal",
      ) ??
      media?.galleryImages?.[0] ??
      getPrimaryThumbnail(event)
    );
  }

  if (event?.slug === "texture-painting") {
    return (
      media?.galleryImages?.find(
        (asset) =>
          asset.id ===
          "art-community-showcase",
      ) ??
      media?.galleryImages?.[0] ??
      getPrimaryThumbnail(event)
    );
  }

  return (
    media?.galleryImages?.[0] ??
    media?.thumbnails?.[0] ??
    media?.heroImages?.[0] ??
    FALLBACK_IMAGE
  );
}

export function getBackgroundVideo(
  event: EventData,
): VideoAsset | undefined {
  const media = getEventMedia(event);

  return media?.videos?.find(
    (video) =>
      video?.usability ===
        "background" && !!video?.src,
  );
}