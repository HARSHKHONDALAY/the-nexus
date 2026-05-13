import SectionWrapper from "@/components/layout/section-wrapper";
type EventData = any;

interface EventFaqProps {
  event: EventData;
}

export default function EventFaq({ event }: EventFaqProps) {
  return (
    <SectionWrapper spacing="default" className="border-y border-white/10 bg-black/40" blendTop blendBottom>
      <div className="mb-12 md:mb-14">
        <p className="text-xs uppercase tracking-[0.34em] text-white/60">FAQ</p>
      </div>

      <div className="space-y-4">
        {event.faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-white/10 bg-black/45 p-6"
          >
            <summary className="cursor-pointer list-none text-lg font-medium text-white/90 marker:content-none">
              {faq.question}
            </summary>
            <p className="mt-4 text-white/62">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionWrapper>
  );
}
