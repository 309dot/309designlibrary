import * as React from "react";
import { cn } from "./utils";

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("ui-breadcrumb", className)} aria-label="Breadcrumb">
      <ol className="ui-breadcrumb__list">
        {items.map((item, index) => (
          <li key={item.id} className="ui-breadcrumb__item">
            {item.href ? (
              <a href={item.href} className="ui-breadcrumb__link">
                {item.label}
              </a>
            ) : (
              <span className="ui-breadcrumb__current">{item.label}</span>
            )}
            {index < items.length - 1 ? (
              <span className="ui-breadcrumb__sep" aria-hidden>
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
