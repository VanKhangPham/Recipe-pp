import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-label-mono-sm text-label-mono-sm font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-surface-container text-on-surface-variant",
        easy: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#15803D]/20 dark:text-[#79db8d]",
        medium: "bg-[#FEF3C7] text-[#B45309] dark:bg-[#B45309]/20 dark:text-[#fbbf24]",
        hard: "bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#B91C1C]/20 dark:text-[#f87171]",
        pending: "bg-[#F5F5F4] text-[#78716C] dark:bg-[#332e2a] dark:text-[#cec5bf]",
        published: "bg-[#E0F2FE] text-[#0369A1] dark:bg-[#0369A1]/20 dark:text-[#38bdf8]",
        primary: "bg-primary-fixed text-on-primary-fixed font-semibold",
        secondary: "bg-secondary-container text-on-secondary-container font-medium",
        outline: "border border-outline-variant/60 text-on-surface-variant bg-transparent",
        spotlight: "bg-surface-container-lowest/90 backdrop-blur-md text-primary font-semibold shadow-sm",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2.5 py-0.5 text-[11px]",
        lg: "px-3.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
