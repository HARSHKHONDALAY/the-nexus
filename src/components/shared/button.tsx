import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const nexusButtonVariants = cva(
  [
    "group inline-flex items-center justify-center gap-2 rounded-full",
    "text-sm font-medium tracking-[0.06em] uppercase",
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
          "border border-lime-300/55 bg-lime-300 text-[#03111f]",
          "shadow-[0_1px_0_rgba(224,247,255,0.5)_inset,0_0_24px_rgba(56,189,248,0.24)]",
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
        default: "h-11 px-6 text-[0.73rem]",
        compact: "h-10 px-5 text-[0.69rem]",
        roomy: "h-12 px-7 sm:px-8 text-[0.74rem]",
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
  const buttonClassName = cn(nexusButtonVariants({ variant, size, className }));
  const content = (
    <>
      {startIcon ? <span className="flex shrink-0 items-center justify-center leading-none">{startIcon}</span> : null}
      <span className="flex items-center leading-none">{children}</span>
      {endIcon ? (
        <span className="flex shrink-0 items-center justify-center leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
          {endIcon}
        </span>
      ) : null}
    </>
  );

  if (asChild && React.isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
    return React.cloneElement(children, {
      className: cn(buttonClassName, children.props.className),
      ...props,
      children: (
        <>
          {startIcon ? <span className="flex shrink-0 items-center justify-center leading-none">{startIcon}</span> : null}
          <span className="flex items-center leading-none">{children.props.children}</span>
          {endIcon ? (
            <span className="flex shrink-0 items-center justify-center leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
              {endIcon}
            </span>
          ) : null}
        </>
      ),
    });
  }

  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp className={buttonClassName} {...props}>
      {content}
    </Comp>
  );
}

export { nexusButtonVariants };
