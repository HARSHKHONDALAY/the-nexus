import type { EventData } from "@/lib/api/event-mappers";

import type {
  EventAssetSet,
  ImageAsset,
  VideoAsset,
} from "@/data/eventAssetTypes";

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

  width: 1200,

  height: 800,

  quality: "usable",

  suitability: [
    "thumbnail",
    "gallery",
    "hero",
  ],
};

const GENERIC_FALLBACK_SET: EventAssetSet = {
  world: "The Chess Nexus", // Use valid type for compatibility

  tone: ["fallback"],

  heroImages: [FALLBACK_IMAGE],

  galleryImages: [FALLBACK_IMAGE],

  portraitGallery: [],

  landscapeGallery: [FALLBACK_IMAGE],

  videos: [],

  thumbnails: [FALLBACK_IMAGE],

  posters: [FALLBACK_IMAGE],
};

export function getEventMedia(
  _event: EventData,
): EventAssetSet {
  // Always return generic fallback - no event-specific assets
  void _event; // Explicitly mark as unused
  return GENERIC_FALLBACK_SET;
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
  // If event has a poster image URL, use it
  if (event?.posterImageUrl) {
    return {
      id: "uploaded-poster",
      src: event.posterImageUrl,
      alt: event.title || "Event",
      label: "Uploaded Poster",
      intent: "thumbnail",
      orientation: "landscape",
      aspectRatio: "16/9",
      width: 1920,
      height: 1080,
      quality: "excellent",
      suitability: ["thumbnail", "gallery", "hero"],
    };
  }

  const media = getEventMedia(event);

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
    (video: VideoAsset) =>
      video?.usability ===
        "background" && !!video?.src,
  );
}