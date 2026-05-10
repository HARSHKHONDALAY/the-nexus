import { artAssets } from "@/data/artAssets";
import { chessAssets } from "@/data/chessAssets";
import type { EventAssetSet, ImageAsset, VideoAsset } from "@/data/eventAssetTypes";
import type { EventData } from "@/lib/events";

export type { EventAssetSet, ImageAsset, VideoAsset };

export const eventAssetSets = {
  "The Chess Nexus": chessAssets,
  "The Art Nexus": artAssets,
} satisfies Record<EventData["world"], EventAssetSet>;

export function getEventMedia(event: EventData): EventAssetSet {
  return eventAssetSets[event.world];
}

export function getPrimaryHeroImage(event: EventData): ImageAsset {
  return getEventMedia(event).heroImages[0];
}

export function getPrimaryThumbnail(event: EventData): ImageAsset {
  return getEventMedia(event).thumbnails[0] ?? getPrimaryHeroImage(event);
}

export function getEventCardImage(event: EventData): ImageAsset {
  const media = getEventMedia(event);

  if (event.slug === "checkmate-chaos") {
    return (
      media.galleryImages.find((asset) => asset.id === "chess-community-proof") ??
      media.galleryImages[0] ??
      getPrimaryThumbnail(event)
    );
  }

  if (event.slug === "chess-social-night") {
    return (
      media.galleryImages.find((asset) => asset.id === "chess-main-floor") ??
      media.galleryImages.find((asset) => asset.id === "chess-social-signal") ??
      media.galleryImages[0] ??
      getPrimaryThumbnail(event)
    );
  }

  if (event.slug === "texture-painting") {
    return (
      media.galleryImages.find((asset) => asset.id === "art-community-showcase") ??
      media.galleryImages[0] ??
      getPrimaryThumbnail(event)
    );
  }

  return media.galleryImages[0] ?? getPrimaryThumbnail(event);
}

export function getBackgroundVideo(event: EventData): VideoAsset | undefined {
  return getEventMedia(event).videos.find((video) => video.usability === "background" && video.src);
}
