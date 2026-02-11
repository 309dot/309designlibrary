import * as React from "react";
import { cn } from "./utils";

export type BadgeTone =
  | "neutral"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "purple";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
}

export function Badge({
  className,
  tone = "neutral",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn("ui-badge", `ui-badge--${tone}`, `ui-badge--${size}`, className)}
      {...props}
    />
  );
}
