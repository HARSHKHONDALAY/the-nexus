interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-4 text-xs uppercase tracking-[0.34em] text-lime-100/48 md:text-sm">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-4xl font-medium leading-[1.02] tracking-[-0.02em] text-lime-50 md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-base leading-relaxed text-lime-100/62 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}