import * as React from "react";
import { cn } from "./utils";

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
}

export function KpiCard({ title, value, change, className, ...props }: KpiCardProps) {
  return (
    <div className={cn("ui-kpi", className)} {...props}>
      <div className="ui-kpi__title">{title}</div>
      <div className="ui-kpi__value">{value}</div>
      {change ? <div className="ui-kpi__change">{change}</div> : null}
    </div>
  );
}
