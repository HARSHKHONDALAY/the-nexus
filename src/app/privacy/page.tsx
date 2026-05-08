import LegalPageShell from "@/components/shared/legal-page-shell";

export default function PrivacyPage() {
  return (
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
  );
}

