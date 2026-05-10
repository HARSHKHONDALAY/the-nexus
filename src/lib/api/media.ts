import type { PlatformEvent } from "./events";
import type { EventAssetSet, ImageAsset, VideoAsset } from "@/data/eventAssetTypes";
import type { EventData } from "@/lib/events";

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
  createdAt: string;
  updatedAt: string;
}

// Fallback media system for when backend assets are not available
export function getFallbackMediaAssetSet(world: EventData["world"]): DynamicEventAssetSet {
  // Import the existing hardcoded assets as fallback
  if (world === "The Chess Nexus") {
    return {
      heroImages: [
        {
          id: "chess-hero-fallback",
          src: "/events/chess-nexus/hero.jpg",
          alt: "Chess Nexus Event",
          width: 1920,
          height: 1080,
        },
      ],
      thumbnails: [
        {
          id: "chess-thumb-fallback",
          src: "/events/chess-nexus/thumbnail.jpg",
          alt: "Chess Nexus",
          width: 400,
          height: 300,
        },
      ],
      galleryImages: [
        {
          id: "chess-gallery-1",
          src: "/events/chess-nexus/gallery-1.jpg",
          alt: "Chess Community",
          width: 800,
          height: 600,
        },
        {
          id: "chess-gallery-2",
          src: "/events/chess-nexus/gallery-2.jpg",
          alt: "Chess Tournament",
          width: 800,
          height: 600,
        },
      ],
      videos: [],
    };
  }

  // Art Nexus fallback
  return {
    heroImages: [
      {
        id: "art-hero-fallback",
        src: "/events/art-nexus/hero.jpg",
        alt: "Art Nexus Event",
        width: 1920,
        height: 1080,
      },
    ],
    thumbnails: [
      {
        id: "art-thumb-fallback",
        src: "/events/art-nexus/thumbnail.jpg",
        alt: "Art Nexus",
        width: 400,
        height: 300,
      },
    ],
    galleryImages: [
      {
        id: "art-gallery-1",
        src: "/events/art-nexus/gallery-1.jpg",
        alt: "Art Workshop",
        width: 800,
        height: 600,
      },
      {
        id: "art-gallery-2",
        src: "/events/art-nexus/gallery-2.jpg",
        alt: "Creative Session",
        width: 800,
        height: 600,
      },
    ],
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
    if ("ticketTiers" in event && (event as PlatformEvent).id) {
      const platformEvent = event as PlatformEvent;
      
      // Try to fetch media assets from backend
      // This would require a new API endpoint like /events/{id}/media
      // For now, we'll use the fallback system
      
      // const backendAssets = await fetchEventMediaAssets(platformEvent.id);
      // return mapBackendMediaToFrontend(backendAssets);
    }

    // Use fallback based on world/type
    const world = ("world" in event) ? event.world : 
                 (event.category?.slug === "chess-nexus") ? "The Chess Nexus" : 
                 (event.category?.slug === "art-nexus") ? "The Art Nexus" : 
                 "The Chess Nexus";

    return getFallbackMediaAssetSet(world);
  } catch (error) {
    console.error("Failed to load event media, using fallback:", error);
    
    // Ultimate fallback
    const world = ("world" in event) ? event.world : "The Chess Nexus";
    return getFallbackMediaAssetSet(world);
  }
}

// Get primary thumbnail with fallback
export async function getPrimaryThumbnailWithFallback(event: PlatformEvent | EventData): Promise<DynamicImageAsset> {
  const mediaSet = await getEventMediaWithFallback(event);
  return mediaSet.thumbnails[0] || mediaSet.heroImages[0] || {
    id: "ultimate-fallback",
    src: "/events/default-thumbnail.jpg",
    alt: "Event",
    width: 400,
    height: 300,
  };
}

// Get event card image with fallback
export async function getEventCardImageWithFallback(event: PlatformEvent | EventData): Promise<DynamicImageAsset> {
  const mediaSet = await getEventMediaWithFallback(event);
  
  // Try to find specific images by slug if available
  const slug = ("slug" in event) ? event.slug : "unknown";
  
  if (slug === "checkmate-chaos") {
    return (
      mediaSet.galleryImages.find((asset) => asset.id.includes("community")) ??
      mediaSet.galleryImages[0] ??
      mediaSet.thumbnails[0] ??
      mediaSet.heroImages[0] ??
      {
        id: "chess-chaos-fallback",
        src: "/events/chess-nexus/checkmate-chaos.jpg",
        alt: "Checkmate Chaos",
        width: 800,
        height: 600,
      }
    );
  }

  // Default fallback
  return mediaSet.galleryImages[0] || mediaSet.thumbnails[0] || mediaSet.heroImages[0] || {
    id: "default-card",
    src: "/events/default-card.jpg",
    alt: "Event",
    width: 800,
    height: 600,
  };
}

// Get background video with fallback
export async function getBackgroundVideoWithFallback(event: PlatformEvent | EventData): Promise<DynamicVideoAsset | undefined> {
  const mediaSet = await getEventMediaWithFallback(event);
  return mediaSet.videos.find((video) => video.usability === "background" && video.src);
}
