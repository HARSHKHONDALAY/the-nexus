import type { Metadata, Viewport } from "next";
import "./globals.css";
import BackgroundGrain from "@/components/animations/background-grain";
import AnalyticsScripts from "@/components/seo/analytics";
import JsonLd from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo/config";
import { createMetadata } from "@/lib/seo/metadata";
import { jsonLdGraph, localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo/schema";

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const verificationOther = Object.fromEntries(
  Object.entries(siteConfig.verification.other).filter((entry): entry is [string, string] => Boolean(entry[1])),
);

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createMetadata({
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    path: "/",
  }),
  applicationName: "The Nexus",
  authors: [{ name: "The Nexus", url: siteConfig.url }],
  creator: "The Nexus",
  publisher: "The Nexus",
  category: "Events",
  classification: "Premium event platform",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/branding/favicon.ico", sizes: "any" },
      { url: "/branding/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/branding/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/branding/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/branding/favicon.ico",
    apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "The Nexus",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: siteConfig.verification.google,
    yandex: siteConfig.verification.yandex,
    yahoo: siteConfig.verification.yahoo,
    other: verificationOther,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#020617",
    "msapplication-TileImage": "/branding/icon-192.png",
    "geo.region": siteConfig.region,
    "geo.placename": siteConfig.city,
    "geo.country": siteConfig.countryCode,
    "ICBM": `${siteConfig.coordinates.latitude},${siteConfig.coordinates.longitude}`,
    "distribution": "global",
    "rating": "general",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} data-scroll-behavior="smooth">
      <body className="bg-black text-white antialiased">
        <JsonLd id="nexus-global-schema" data={jsonLdGraph([organizationSchema(), websiteSchema(), localBusinessSchema()])} />
        <BackgroundGrain />
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
