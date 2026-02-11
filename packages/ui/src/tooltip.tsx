import * as React from "react";
import { cn } from "./utils";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("ui-tooltip", className)} data-tooltip={content}>
      {children}
    </span>
  );
}
