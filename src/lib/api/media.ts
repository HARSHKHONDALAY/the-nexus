import type { PlatformEvent } from "./events";
import type { EventData } from "@/lib/api/event-mappers";

// Dynamic image asset for backend URLs (different from StaticImageData)
export interface DynamicImageAsset {
  id: string;
  src: string; // URL string instead of StaticImageData
  alt: string;
  width: number;
  height: number;
}

// Dynamic video asset for backend URLs
export interface DynamicVideoAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  duration?: number;
  usability?: "background" | "supporting" | "needs-transcode";
}

// Dynamic event asset set
export interface DynamicEventAssetSet {
  heroImages: DynamicImageAsset[];
  thumbnails: DynamicImageAsset[];
  galleryImages: DynamicImageAsset[];
  videos: DynamicVideoAsset[];
}

// Backend media asset types
export interface BackendMediaAsset {
  id: string;
  eventId: string;
  mediaType: "IMAGE" | "VIDEO" | "THUMBNAIL";
  storageKey: string;
  publicUrl?: string;
  mimeType: string;
  sizeBytes: number;
  status: "UPLOADED" | "PROCESSING" | "PUBLISHED" | "ARCHIVED" | "REJECTED";
  altText?: string;
  sortOrder: number;
  created_at: string;
  updated_at: string;
}

// Generic fallback media system - no event-specific assets
export function getFallbackMediaAssetSet(): DynamicEventAssetSet {
  const genericPlaceholder = {
    id: "generic-placeholder",
    src: "/events/default-thumbnail.jpg",
    alt: "Event",
    width: 1200,
    height: 800,
  };

  return {
    heroImages: [genericPlaceholder],
    thumbnails: [genericPlaceholder],
    galleryImages: [genericPlaceholder],
    videos: [],
  };
}

// Convert backend media assets to frontend format
export function mapBackendMediaToFrontend(backendAssets: BackendMediaAsset[]): DynamicEventAssetSet {
  const heroImages: DynamicImageAsset[] = [];
  const thumbnails: DynamicImageAsset[] = [];
  const galleryImages: DynamicImageAsset[] = [];
  const videos: DynamicVideoAsset[] = [];

  backendAssets
    .filter(asset => asset.status === "PUBLISHED" && asset.publicUrl)
    .forEach(asset => {
      const imageAsset: DynamicImageAsset = {
        id: asset.id,
        src: asset.publicUrl!,
        alt: asset.altText || "Event image",
        width: 1920, // Default dimensions, should be stored in backend ideally
        height: 1080,
      };

      const videoAsset: DynamicVideoAsset = {
        id: asset.id,
        src: asset.publicUrl!,
        alt: asset.altText || "Event video",
        width: 1920,
        height: 1080,
        duration: 60, // Default duration
        usability: asset.mediaType === "VIDEO" ? "background" : undefined,
      };

      if (asset.mediaType === "THUMBNAIL") {
        thumbnails.push(imageAsset);
      } else if (asset.mediaType === "IMAGE") {
        // Sort by sortOrder to determine if it's a hero or gallery image
        if (asset.sortOrder === 0) {
          heroImages.push(imageAsset);
        } else {
          galleryImages.push(imageAsset);
        }
      } else if (asset.mediaType === "VIDEO") {
        videos.push(videoAsset);
      }
    });

  return { heroImages, thumbnails, galleryImages, videos };
}

// Get media for an event with fallback support
export async function getEventMediaWithFallback(event: PlatformEvent | EventData): Promise<DynamicEventAssetSet> {
  try {
    // If we have a PlatformEvent with media assets, use them
    if ("ticketTiers" in event && (event as unknown as PlatformEvent).id) {
      
      // Try to fetch media assets from backend
      // This would require a new API endpoint like /events/{id}/media
      // For now, we'll use the fallback system
      
      // const backendAssets = await fetchEventMediaAssets(platformEvent.id);
      // return mapBackendMediaToFrontend(backendAssets);
    }

    // Use generic fallback - no event-specific logic
    return getFallbackMediaAssetSet();
  } catch (error) {
    console.error("Failed to load event media, using fallback:", error);
    
    // Ultimate fallback
    return getFallbackMediaAssetSet();
  }
}

// Get primary thumbnail with fallback
export async function getPrimaryThumbnailWithFallback(event: PlatformEvent | EventData): Promise<DynamicImageAsset> {
  const mediaSet = await getEventMediaWithFallback(event);
  return mediaSet.thumbnails[0] || mediaSet.heroImages[0] || {
    id: "ultimate-fallback",
    src: "/events/default-thumbnail.jpg",
    alt: "Event",
    width: 1200,
    height: 800,
  };
}

// Get event card image with fallback
export async function getEventCardImageWithFallback(event: PlatformEvent | EventData): Promise<DynamicImageAsset> {
  const mediaSet = await getEventMediaWithFallback(event);
  
  // Generic fallback logic - no hardcoded test slug references
  return (
    mediaSet.galleryImages.find((asset) => asset.id.includes("community")) ??
    mediaSet.galleryImages[0] ??
    mediaSet.heroImages[0] ??
    {
      id: "default-gallery-fallback",
      src: "/events/default-gallery.jpg",
      alt: "Event Gallery",
      width: 800,
      height: 600,
    }
  );
}

// Get background video with fallback
export async function getBackgroundVideoWithFallback(event: PlatformEvent | EventData): Promise<DynamicVideoAsset | undefined> {
  const mediaSet = await getEventMediaWithFallback(event);
  return mediaSet.videos.find((video) => video.usability === "background" && video.src);
}
