import * as React from "react";
import { cn } from "./utils";

export type TagTone =
  | "neutral"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "purple";

export type TagSize = "sm" | "md";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  size?: TagSize;
  outline?: boolean;
}

export function Tag({
  className,
  tone = "neutral",
  size = "md",
  outline = true,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "ui-tag",
        `ui-tag--${tone}`,
        `ui-tag--${size}`,
        outline && "ui-tag--outline",
        className,
      )}
      {...props}
    />
  );
}
