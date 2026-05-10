import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";
import { absoluteUrl } from "@/lib/seo/metadata";

const privatePaths = ["/admin/", "/super-admin/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
