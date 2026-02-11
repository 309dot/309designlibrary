import * as React from "react";
import { cn } from "./utils";

export interface StepItem {
  id: string;
  label: string;
  status?: "done" | "current" | "upcoming";
}

export interface StepsProps {
  items: StepItem[];
  className?: string;
}

export function Steps({ items, className }: StepsProps) {
  return (
    <ol className={cn("ui-steps", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cn("ui-steps__item", item.status && `is-${item.status}`)}
        >
          <span className="ui-steps__dot" aria-hidden />
          <span className="ui-steps__label">{item.label}</span>
        </li>
      ))}
    </ol>
  );
}
