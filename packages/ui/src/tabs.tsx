import * as React from "react";
import { cn } from "./utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ items, defaultTab, onChange, className }: TabsProps) {
  const first = items[0]?.id;
  const [active, setActive] = React.useState(defaultTab ?? first);

  return (
    <div className={cn("ui-tabs", className)}>
      <div className="ui-tabs__list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "ui-tabs__trigger",
              active === item.id && "is-active",
            )}
            onClick={() => {
              if (item.disabled) return;
              setActive(item.id);
              onChange?.(item.id);
            }}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ui-tabs__content">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "ui-tabs__panel",
              active === item.id && "is-active",
            )}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
