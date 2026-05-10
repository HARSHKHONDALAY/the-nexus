type JsonLdProps = {
  id?: string;
  data: Record<string, unknown> | Record<string, unknown>[];
};

function sanitizeJsonLd(data: JsonLdProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(data) }}
    />
  );
}
