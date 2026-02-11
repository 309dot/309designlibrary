import * as React from "react";
import { cn } from "./utils";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
}

export function Sidebar({ header, className, children, ...props }: SidebarProps) {
  return (
    <aside className={cn("ui-sidebar", className)} {...props}>
      {header ? <div className="ui-sidebar__header">{header}</div> : null}
      <div className="ui-sidebar__body">{children}</div>
    </aside>
  );
}
