import type { Metadata } from "next";
import { siteConfig } from "./config";

type SeoMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  follow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

function dedupe(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trimEnd()}...` : value;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path.includes("%") ? path : encodeURI(path);
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${cleanPath}`;
  return url.includes("%") ? url : encodeURI(url);
}

export function ogImageUrl(
  title: string,
  eyebrow = "The Nexus",
  variant: "default" | "event" = "default",
  description?: string,
) {
  const params = new URLSearchParams({ title, eyebrow, variant });
  if (description) params.set("description", truncate(description, 120));
  return absoluteUrl(`/og?${params.toString()}`);
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  follow,
  publishedTime,
  modifiedTime,
}: SeoMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : ogImageUrl(title, "The Nexus", "default", description);
  const mergedKeywords = dedupe([...siteConfig.keywords, ...keywords]);
  const shouldFollow = noIndex ? Boolean(follow) : true;

  return {
    title,
    description,
    keywords: mergedKeywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Events",
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: shouldFollow,
          nocache: true,
          googleBot: {
            index: false,
            follow: shouldFollow,
            noimageindex: true,
            "max-video-preview": 0,
            "max-image-preview": "none",
            "max-snippet": 0,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt ?? `${title} social preview`,
        },
      ],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const noIndexMetadata = (title: string, description = "This page is not intended for search indexing.") =>
  createMetadata({ title, description, noIndex: true });

// Event SEO functions removed - now using backend API directly
