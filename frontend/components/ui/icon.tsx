import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
  size?: number | string;
}

export function Icon({
  name,
  filled = false,
  size,
  className,
  style,
  ...props
}: IconProps) {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(size ? { fontSize: typeof size === "number" ? `${size}px` : size } : {}),
    ...(filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}),
  };

  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={customStyle}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
