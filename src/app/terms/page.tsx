import JsonLd from "@/components/seo/json-ld";
import LegalPageShell from "@/components/shared/legal-page-shell";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Terms of Service | The Nexus";
const description = "Read The Nexus terms for event bookings, attendee conduct, tickets, and platform usage.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/terms",
  keywords: ["The Nexus terms", "event ticket terms", "attendee conduct"],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        id="terms-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/terms", title, description, breadcrumbs }),
        ])}
      />
      <LegalPageShell
        title="Terms of Experience"
        description="These terms outline participation, conduct, and access standards for The Nexus ecosystem."
        sections={[
          {
            heading: "Access and Participation",
            body: "Event access and membership privileges are curated. Entry may be denied for safety, policy, or capacity reasons.",
          },
          {
            heading: "Community Conduct",
            body: "The Nexus is a belonging-first environment. Harassment, abuse, or disruption may lead to immediate removal.",
          },
          {
            heading: "Platform Use",
            body: "By using The Nexus digital platform, you agree to respectful conduct, accurate submissions, and policy compliance.",
          },
        ]}
      />
    </>
  );
}
