import JsonLd from "@/components/seo/json-ld";
import LegalPageShell from "@/components/shared/legal-page-shell";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/seo/schema";

const title = "Privacy Policy | The Nexus";
const description = "Read how The Nexus handles attendee information, registrations, analytics, and platform data.";
const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const metadata = createMetadata({
  title,
  description,
  path: "/privacy",
  keywords: ["The Nexus privacy", "event data policy", "registration privacy"],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        id="privacy-schema"
        data={jsonLdGraph([
          breadcrumbSchema(breadcrumbs),
          webPageSchema({ path: "/privacy", title, description, breadcrumbs }),
        ])}
      />
      <LegalPageShell
        title="Privacy"
        description="We handle personal data with care and only use what is necessary to run a secure, curated culture ecosystem."
        sections={[
          {
            heading: "Information We Collect",
            body: "We may collect profile details, registration information, and communication context required for experience operations.",
          },
          {
            heading: "How We Use Data",
            body: "Data is used for event operations, communication, and community safety. We do not sell your personal data.",
          },
          {
            heading: "Your Controls",
            body: "You may request updates or deletion of personal data by contacting the Nexus support channels.",
          },
        ]}
      />
    </>
  );
}
