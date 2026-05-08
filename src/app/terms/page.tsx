import LegalPageShell from "@/components/shared/legal-page-shell";

export default function TermsPage() {
  return (
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
  );
}

