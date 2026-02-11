import * as React from "react";
import { cn } from "./utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Popover({ trigger, children, className }: PopoverProps) {
  return (
    <details className={cn("ui-popover", className)}>
      <summary className="ui-popover__trigger">{trigger}</summary>
      <div className="ui-popover__content">{children}</div>
    </details>
  );
}
