import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const nexusButtonVariants = cva(
  [
    "group inline-flex items-center justify-center gap-2 rounded-full",
    "text-sm font-medium tracking-[0.08em] uppercase",
    "transition-[background-color,border-color,color,transform,box-shadow]",
    "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-lime-300/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border border-lime-300/55 bg-lime-300 text-[#061006]",
          "shadow-[0_1px_0_rgba(211,255,183,0.55)_inset,0_0_20px_rgba(145,255,98,0.2)]",
          "hover:-translate-y-[1px] hover:bg-lime-200",
        ],
        secondary: [
          "border border-lime-300/35 bg-lime-400/[0.06] text-lime-100",
          "backdrop-blur-xl",
          "hover:-translate-y-[1px] hover:border-lime-300/60 hover:bg-lime-300/[0.14]",
        ],
        ghost: [
          "border border-transparent bg-transparent text-lime-100/78",
          "hover:text-lime-100 hover:bg-lime-300/[0.12]",
        ],
      },
      size: {
        default: "h-11 px-6 text-[0.75rem]",
        compact: "h-10 px-5 text-[0.72rem]",
        roomy: "h-12 px-8 text-[0.76rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof nexusButtonVariants> {
  asChild?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp className={cn(nexusButtonVariants({ variant, size, className }))} {...props}>
      {startIcon ? <span className="shrink-0">{startIcon}</span> : null}
      <span>{children}</span>
      {endIcon ? (
        <span className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
          {endIcon}
        </span>
      ) : null}
    </Comp>
  );
}

export { nexusButtonVariants };
