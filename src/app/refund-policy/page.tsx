import LegalPageShell from "@/components/shared/legal-page-shell";

export default function RefundPolicyPage() {
  return (
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
  );
}

