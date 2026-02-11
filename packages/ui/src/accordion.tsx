import * as React from "react";
import { cn } from "./utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("ui-accordion", className)}>
      {items.map((item) => (
        <details key={item.id} className="ui-accordion__item">
          <summary className="ui-accordion__trigger">{item.title}</summary>
          <div className="ui-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
