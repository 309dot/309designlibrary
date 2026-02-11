import * as React from "react";
import { cn } from "./utils";

export interface PaginationProps {
  page: number;
  total: number;
  onChange?: (page: number) => void;
  className?: string;
}

export function Pagination({ page, total, onChange, className }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, idx) => idx + 1);
  return (
    <div className={cn("ui-pagination", className)}>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={cn("ui-pagination__item", page === p && "is-active")}
          onClick={() => onChange?.(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
