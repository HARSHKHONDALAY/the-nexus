import { founderProfiles } from "@/data/founderAssets";
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

// Event date functions removed - now using backend API directly

export function eventItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl("/events#event-list"),
    name: "Upcoming Nexus events",
    itemListElement: [], // Empty since we're using backend API
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
