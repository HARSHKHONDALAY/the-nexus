const productionFallbackUrl = "https://www.thenexus.in";

function normalizeSiteUrl(value?: string) {
  try {
    const url = new URL(value ?? productionFallbackUrl);
    return url.origin;
  } catch {
    return productionFallbackUrl;
  }
}

export const siteConfig = {
  name: "The Nexus",
  legalName: "The Nexus",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  defaultTitle: "The Nexus | Premium Events, Chess Socials & Art Workshops in Mumbai",
  description:
    "The Nexus is a premium cinematic event ecosystem for chess socials, art workshops, networking experiences, and curated culture rooms in Mumbai.",
  locale: "en_IN",
  language: "en-IN",
  region: "IN-MH",
  city: "Mumbai",
  country: "India",
  countryCode: "IN",
  coordinates: {
    latitude: 19.076,
    longitude: 72.8777,
  },
  defaultOgImage: "/branding/og-image.png",
  defaultOgImageAlt: "The Nexus premium event ecosystem in Mumbai",
  logo: "/branding/logo.png",
  priceRange: "INR 600-2598",
  sameAs: [
    "https://in.bookmyshow.com/sports/the-chess-nexus/ET00435654",
  ],
  keywords: [
    "The Nexus",
    "Mumbai events",
    "premium events Mumbai",
    "chess events Mumbai",
    "art workshops Mumbai",
    "networking events Mumbai",
    "social experiences Mumbai",
    "community events",
    "culture events",
    "creative workshops",
    "premium social events",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
      "facebook-domain-verification": process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION,
    },
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  },
  nonIndexablePaths: [
    "/admin",
    "/super-admin",
    "/api",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/session-expired",
    "/unauthorized",
  ],
};

export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

export const publicRoutes: SiteRoute[] = [
  {
    path: "/",
    title: "The Nexus | Premium Events, Chess Socials & Art Workshops in Mumbai",
    description:
      "Discover The Nexus, a cinematic Mumbai event ecosystem for chess socials, art workshops, networking nights, and premium community experiences.",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/events",
    title: "Upcoming Premium Events in Mumbai | The Nexus",
    description:
      "Explore upcoming Nexus events across chess nights, art workshops, networking experiences, and curated social rooms in Mumbai.",
    priority: 0.95,
    changeFrequency: "daily",
  },
  {
    path: "/moments",
    title: "Event Moments & Community Gallery | The Nexus",
    description:
      "See cinematic moments from The Nexus culture rooms, chess socials, art workshops, and premium community events.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    title: "About The Nexus | Premium Culture & Event Ecosystem",
    description:
      "Meet The Nexus, a Mumbai-born event ecosystem designing premium social experiences across chess, art, culture, and community.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    title: "Contact The Nexus | Partnerships, Events & Community",
    description:
      "Contact The Nexus for event partnerships, collaborations, brand experiences, and premium community programming in Mumbai.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service | The Nexus",
    description: "Read The Nexus terms for event bookings, attendee conduct, tickets, and platform usage.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | The Nexus",
    description: "Read how The Nexus handles attendee information, registrations, analytics, and platform data.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
  {
    path: "/refund-policy",
    title: "Refund Policy | The Nexus",
    description: "Review The Nexus refund policy for event tickets, cancellations, transfers, and exceptional cases.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
];
