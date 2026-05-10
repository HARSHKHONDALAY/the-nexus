import JsonLd from "@/components/seo/json-ld";
import LegalPageShell from "@/components/shared/legal-page-shell";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Refund Policy | The Nexus";
const description = "Review The Nexus refund policy for event tickets, cancellations, transfers, and exceptional cases.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Refund Policy", path: "/refund-policy" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/refund-policy",
  keywords: ["The Nexus refund policy", "event ticket refunds", "ticket cancellation policy"],
});

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        id="refund-policy-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/refund-policy", title, description, breadcrumbs }),
        ])}
      />
      <LegalPageShell
        title="Refund Policy"
        description="Our refund policy protects both the curated event experience and member fairness."
        sections={[
          {
            heading: "Cancellation Windows",
            body: "Refund eligibility depends on event-specific windows. Most experiences require cancellation before the cutoff period.",
          },
          {
            heading: "Transfers",
            body: "Where allowed, pass transfers may be permitted subject to host approval and policy constraints.",
          },
          {
            heading: "No-Show Policy",
            body: "No-shows are generally non-refundable due to limited capacity and curated access allocation.",
          },
        ]}
      />
    </>
  );
}
