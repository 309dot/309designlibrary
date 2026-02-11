import * as React from "react";
import { cn } from "./utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ width, height, className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("ui-skeleton", className)}
      style={{ width, height }}
      {...props}
    />
  );
}
