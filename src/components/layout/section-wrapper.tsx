import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionWrapperVariants = cva("relative z-10", {
  variants: {
    spacing: {
      compact: "py-20 md:py-24",
      default: "py-24 md:py-32",
      relaxed: "py-28 md:py-36",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  spacing?: VariantProps<typeof sectionWrapperVariants>["spacing"];
  blendTop?: boolean;
  blendBottom?: boolean;
}

export default function SectionWrapper({
  children,
  className = "",
  innerClassName = "",
  id,
  spacing = "default",
  blendTop = false,
  blendBottom = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(sectionWrapperVariants({ spacing }), className)}
    >
      {blendTop ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent md:h-28" />
      ) : null}
      <div className={cn("container-custom", innerClassName)}>
        {children}
      </div>
      {blendBottom ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black/65 md:h-28" />
      ) : null}
    </section>
  );
}