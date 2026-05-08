import SectionWrapper from "@/components/layout/section-wrapper";

const methods = [
  {
    title: "Collaborations",
    note: "Brand-aligned culture collaborations and experiences.",
    email: "collabs@thenexus.example",
  },
  {
    title: "Partnerships",
    note: "Institutional partnerships and long-term ecosystem building.",
    email: "partners@thenexus.example",
  },
  {
    title: "World Submissions",
    note: "Pitch a new culture world or identity room concept.",
    email: "worlds@thenexus.example",
  },
  {
    title: "Press / Media",
    note: "Editorial features, interviews, and media requests.",
    email: "press@thenexus.example",
  },
  {
    title: "Community Inquiries",
    note: "Membership, community questions, and event access.",
    email: "community@thenexus.example",
  },
];

export default function ContactMethods() {
  return (
    <SectionWrapper spacing="default">
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.34em] text-lime-100/48">
          Alternative Methods
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {methods.map((method) => (
          <article
            key={method.title}
            className="rounded-3xl border border-lime-200/16 bg-lime-200/[0.03] p-7"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-lime-50">
              {method.title}
            </h3>
            <p className="mt-3 text-lime-100/62">{method.note}</p>
            <a
              href={`mailto:${method.email}`}
              className="mt-6 inline-flex text-xs uppercase tracking-[0.22em] text-lime-100/78 transition hover:text-lime-50"
            >
              {method.email}
            </a>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}

