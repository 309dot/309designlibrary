import * as React from "react";
import { cn } from "./utils";

export interface DropdownItem {
  id: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  className?: string;
}

export function Dropdown({ label, items, className }: DropdownProps) {
  return (
    <details className={cn("ui-dropdown", className)}>
      <summary className="ui-dropdown__trigger">{label}</summary>
      <div className="ui-dropdown__menu">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ui-dropdown__item"
            onClick={item.onSelect}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}
