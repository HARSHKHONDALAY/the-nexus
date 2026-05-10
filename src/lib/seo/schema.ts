import { founderProfiles } from "@/data/founderAssets";
import { getBackgroundVideo, getEventMedia, getPrimaryHeroImage, getPrimaryThumbnail } from "@/lib/event-media";
import type { EventData } from "@/lib/events";
import { events } from "@/lib/events";
import { absoluteUrl } from "./metadata";
import { siteConfig } from "./config";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type JsonLdNode = Record<string, unknown>;

type WebPageSchemaOptions = {
  path: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryEntityId?: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
};

function stripContext(node: JsonLdNode): JsonLdNode {
  const rest = { ...node };
  delete rest["@context"];
  return rest;
}

export function jsonLdGraph(nodes: Array<JsonLdNode | null | undefined | false>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean).map((node) => stripContext(node as JsonLdNode)),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
    sameAs: siteConfig.sameAs,
    foundingLocation: {
      "@type": "Place",
      name: "Mumbai, Maharashtra, India",
    },
    areaServed: ["Mumbai", "Thane", "Maharashtra", "India"],
    knowsAbout: [
      "premium events",
      "chess events",
      "art workshops",
      "networking experiences",
      "community experiences",
      "culture programming",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: siteConfig.countryCode,
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/events")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#local-business"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    image: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
    priceRange: siteConfig.priceRange,
    sameAs: siteConfig.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "Maharashtra",
      addressCountry: siteConfig.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.latitude,
      longitude: siteConfig.coordinates.longitude,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Mumbai Metropolitan Region",
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Event", name: "Chess events in Mumbai" } },
      { "@type": "Offer", itemOffered: { "@type": "Event", name: "Art workshops in Mumbai" } },
      { "@type": "Offer", itemOffered: { "@type": "Event", name: "Networking and social experiences" } },
    ],
  };
}

export function webPageSchema({
  path,
  title,
  description,
  breadcrumbs,
  primaryEntityId,
  type = "WebPage",
}: WebPageSchemaOptions) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: siteConfig.language,
    ...(breadcrumbs?.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    ...(primaryEntityId ? { mainEntity: { "@id": primaryEntityId } } : {}),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  const lastItem = items.at(-1);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": lastItem ? `${absoluteUrl(lastItem.path)}#breadcrumb` : absoluteUrl("/#breadcrumb"),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function parsePrice(value: string) {
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match?.[1] ?? "0";
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function getTimezone(value: string) {
  return value.match(/([+-]\d{2}:\d{2})$/)?.[1] ?? "+05:30";
}

function getEventEndDate(event: EventData) {
  const date = event.dateISO.slice(0, 10);
  const timezone = getTimezone(event.dateISO);
  const startTime = event.dateISO.match(/T(\d{2}):(\d{2})/)?.slice(1).map(Number) ?? [0, 0];
  const endMatch = event.time.match(/-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!endMatch) return event.dateISO;
  let hour = Number(endMatch[1]);
  const minute = Number(endMatch[2]);
  const period = endMatch[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  const rollsOver = hour < startTime[0] || (hour === startTime[0] && minute <= startTime[1]);
  const endDate = rollsOver ? addDays(date, 1) : date;
  return `${endDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${timezone}`;
}

function getOfferValidFrom(event: EventData) {
  return `${addDays(event.dateISO.slice(0, 10), -45)}T00:00:00${getTimezone(event.dateISO)}`;
}

function venueAddress(event: EventData) {
  return {
    "@type": "PostalAddress",
    streetAddress: event.venue,
    addressLocality: venueLocality(event),
    addressRegion: "Maharashtra",
    addressCountry: siteConfig.countryCode,
  };
}

function venueLocality(event: EventData) {
  if (/thane/i.test(event.venue)) return "Thane";
  if (/dadar/i.test(event.venue)) return "Dadar, Mumbai";
  return event.city;
}

export function eventSchema(event: EventData) {
  const hero = getPrimaryHeroImage(event);
  const thumbnail = getPrimaryThumbnail(event);
  const registerUrl = absoluteUrl(`/register/${event.eventKey}`);
  const eventUrl = absoluteUrl(`/events/${event.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl}#event`,
    name: event.title,
    description: event.longDescription,
    startDate: event.dateISO,
    endDate: getEventEndDate(event),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: eventUrl,
    mainEntityOfPage: { "@id": `${eventUrl}#webpage` },
    image: [absoluteUrl(hero.src.src), absoluteUrl(thumbnail.src.src), absoluteUrl(siteConfig.defaultOgImage)],
    keywords: [
      event.title,
      event.world,
      `${event.type} in ${event.city}`,
      "premium events Mumbai",
      "community experience",
      ...event.vibePoints,
    ],
    organizer: {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    performer: {
      "@type": "PerformingGroup",
      name: `${siteConfig.name} hosts`,
    },
    location: {
      "@type": "Place",
      name: event.venue,
      address: venueAddress(event),
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.coordinates.latitude,
        longitude: siteConfig.coordinates.longitude,
      },
    },
    offers: event.ticketTiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      url: registerUrl,
      price: parsePrice(tier.price),
      priceCurrency: "INR",
      availability:
        tier.status === "sold_out" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      validFrom: getOfferValidFrom(event),
      validThrough: event.dateISO,
      category: "Primary",
    })),
    isAccessibleForFree: false,
    typicalAgeRange: event.agePolicy,
    audience: {
      "@type": "Audience",
      audienceType: event.agePolicy,
    },
  };
}

export function faqSchema(event: EventData) {
  const eventUrl = absoluteUrl(`/events/${event.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${eventUrl}#faq`,
    mainEntity: event.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function imageObjectSchema(event: EventData) {
  const media = getEventMedia(event);
  return media.galleryImages.slice(0, 5).map((asset) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": `${absoluteUrl(`/events/${event.slug}`)}#image-${asset.id}`,
    contentUrl: absoluteUrl(asset.src.src),
    thumbnailUrl: absoluteUrl(asset.src.src),
    name: `${event.title} - ${asset.label}`,
    caption: asset.label,
    description: asset.alt,
    width: asset.width,
    height: asset.height,
    representativeOfPage: asset.suitability.includes("hero"),
  }));
}

function getVideoUploadDate(event: EventData, sourcePath: string) {
  const filenameDate = sourcePath.match(/(20\d{2})[-_ ]?(\d{2})[-_ ]?(\d{2})/);
  if (!filenameDate) return event.dateISO;

  return `${filenameDate[1]}-${filenameDate[2]}-${filenameDate[3]}T00:00:00${getTimezone(event.dateISO)}`;
}

export function videoObjectSchema(event: EventData) {
  const video = getBackgroundVideo(event);
  if (!video?.src) return null;
  const thumbnail = getPrimaryHeroImage(event);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${absoluteUrl(`/events/${event.slug}`)}#video-${video.id}`,
    name: `${event.title} event atmosphere video`,
    description: `${event.title} cinematic event preview from ${siteConfig.name}.`,
    thumbnailUrl: [absoluteUrl(thumbnail.src.src)],
    uploadDate: getVideoUploadDate(event, video.sourcePath),
    contentUrl: absoluteUrl(video.src),
    embedUrl: absoluteUrl(video.src),
    inLanguage: siteConfig.language,
  };
}

export function eventItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/events#event-list"),
    name: "Upcoming Nexus events",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        "@id": `${absoluteUrl(`/events/${event.slug}`)}#event`,
        name: event.title,
        url: absoluteUrl(`/events/${event.slug}`),
        startDate: event.dateISO,
        image: absoluteUrl(getPrimaryThumbnail(event).src.src),
        location: {
          "@type": "Place",
          name: event.venue,
          address: venueAddress(event),
        },
      },
    })),
  };
}

export function foundersPersonSchema() {
  return founderProfiles.map((founder) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl("/about")}#${founder.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: founder.name,
    jobTitle: founder.role,
    worksFor: { "@id": absoluteUrl("/#organization") },
    image: absoluteUrl(founder.image.src),
    description: founder.statement,
    knowsAbout: founder.metrics,
  }));
}
