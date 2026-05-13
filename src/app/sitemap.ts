import type { MetadataRoute } from "next";

import { events } from "@/lib/events";

import {
  getBackgroundVideo,
  getEventMedia,
  getPrimaryHeroImage,
  getPrimaryThumbnail,
} from "@/lib/event-media";

import {
  publicRoutes,
  siteConfig,
} from "@/lib/seo/config";

import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const eventRoutes = events.map((event) => {
    const heroImage =
      getPrimaryHeroImage(event as any);

    const thumbnail =
      getPrimaryThumbnail(event as any);

    const media =
      getEventMedia(event as any);

    const backgroundVideo =
      getBackgroundVideo(event as any);

    return {
      url: absoluteUrl(
        `/events/${event.slug}`
      ),

      lastModified,

      changeFrequency: "weekly" as const,

      priority: event.featured
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