import * as React from "react";
import { cn } from "./utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <div className={cn("ui-avatar", `ui-avatar--${size}`, className)} {...props}>
      {src ? <img src={src} alt={alt} /> : <span>{fallback ?? "?"}</span>}
    </div>
  );
}
