import * as React from "react";
import { cn } from "./utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  tone?: "neutral" | "positive" | "negative" | "info";
}

export function Stat({ label, value, change, tone = "neutral", className, ...props }: StatProps) {
  return (
    <div className={cn("ui-stat", `ui-stat--${tone}`, className)} {...props}>
      <div className="ui-stat__label">{label}</div>
      <div className="ui-stat__value">{value}</div>
      {change ? <div className="ui-stat__change">{change}</div> : null}
    </div>
  );
}
