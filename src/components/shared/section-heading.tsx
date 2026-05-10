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
    <div className="max-w-[46rem]">
      {eyebrow && (
        <p className="editorial-kicker mb-4 text-lime-100/48 md:text-sm">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-[2.4rem] font-medium leading-[0.98] tracking-[-0.035em] text-lime-50 sm:text-[2.9rem] md:text-[4.2rem]">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-[40rem] text-[0.98rem] leading-7 text-lime-100/62 md:mt-6 md:text-[1.05rem]">
          {description}
        </p>
      )}
    </div>
  );
}
