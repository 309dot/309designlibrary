import * as React from "react";
import { cn } from "./utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className={cn("ui-progress", className)} {...props}>
      <div className="ui-progress__bar" style={{ width: `${value}%` }} />
    </div>
  );
}
