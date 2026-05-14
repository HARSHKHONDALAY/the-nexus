import type { MetadataRoute } from "next";

import { getPublicEvents } from "@/lib/api/events-safe";
import type { PlatformEvent } from "@/lib/api/events-safe";
import {
  getBackgroundVideo,
  getEventMedia,
  getPrimaryHeroImage,
  getPrimaryThumbnail,
} from "@/lib/event-media";
import { mapPlatformEventToEventData } from "@/lib/api/event-mappers";

import {
  publicRoutes,
  siteConfig,
} from "@/lib/seo/config";

import { absoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes = publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),

    lastModified,

    changeFrequency:
      route.changeFrequency ?? "monthly",

    priority: route.priority ?? 0.7,

    images: [
      absoluteUrl(siteConfig.defaultOgImage),
    ],
  }));

  // Fetch live events from backend
  let events: PlatformEvent[] = [];
  try {
    events = await getPublicEvents();
  } catch (error) {
    console.error("Failed to fetch events for sitemap:", error);
    // Continue with empty events array if backend fails
  }

  const eventRoutes = events.map((event) => {
    const eventData = mapPlatformEventToEventData(event);
    
    const heroImage =
      getPrimaryHeroImage(eventData);

    const thumbnail =
      getPrimaryThumbnail(eventData);

    const media =
      getEventMedia(eventData);

    const backgroundVideo =
      getBackgroundVideo(eventData);

    return {
      url: absoluteUrl(
        `/events/${event.slug}`
      ),

      lastModified: (() => {
        const timestamp = event.updated_at || event.created_at;
        try {
          const date = new Date(timestamp);
          // Check if date is valid
          if (!isFinite(date.getTime())) {
            return new Date(); // Return current date as fallback
          }
          return date;
        } catch {
          return new Date(); // Return current date as fallback
        }
      })(),

      changeFrequency: "weekly" as const,

      priority: eventData.featured
        ? 0.95
        : 0.9,

      images: [
        absoluteUrl(String(heroImage.src)),

        absoluteUrl(String(thumbnail.src)),

        ...media.galleryImages
          .slice(0, 3)
          .map((image) =>
            absoluteUrl(String(image.src))
          ),
      ],

      videos: backgroundVideo?.src
        ? [
            {
              title: `${event.title} atmosphere preview`,

              thumbnail_loc: absoluteUrl(
                String(heroImage.src)
              ),

              description: `${event.title} cinematic event preview from ${siteConfig.name}.`,

              content_loc: absoluteUrl(
                backgroundVideo.src
              ),
            },
          ]
        : undefined,
    };
  });

  return [
    ...staticRoutes,
    ...eventRoutes,
  ].map((entry) => ({
    ...entry,

    alternates: {
      languages: {
        "en-IN": entry.url,

        "x-default": entry.url,
      },
    },
  }));
}