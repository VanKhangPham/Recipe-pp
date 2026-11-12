import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-sm font-semibold",
        primary:
          "bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-sm font-semibold",
        secondary:
          "bg-surface-container-low text-on-surface hover:bg-surface-container-high active:scale-[0.98] shadow-[0_1px_4px_rgba(0,0,0,0.03)]",
        outline:
          "border border-outline-variant/50 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low active:scale-[0.98] shadow-xs",
        ghost:
          "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors",
        destructive:
          "bg-error text-on-error hover:opacity-90 active:scale-[0.98] shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl text-body-md gap-2",
        xs: "h-7 px-2.5 rounded-lg text-body-sm gap-1",
        sm: "h-8.5 px-3 rounded-lg text-body-sm gap-1.5",
        lg: "h-12 px-6 rounded-xl text-body-lg gap-2.5",
        pill: "h-10 px-5 rounded-full text-body-md gap-2",
        "pill-sm": "h-8 px-3.5 rounded-full text-body-sm gap-1.5",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8.5 rounded-lg",
        "icon-pill": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
