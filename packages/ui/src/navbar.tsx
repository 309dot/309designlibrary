import * as React from "react";
import { cn } from "./utils";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Navbar({ brand, actions, className, children, ...props }: NavbarProps) {
  return (
    <header className={cn("ui-navbar", className)} {...props}>
      <div className="ui-navbar__brand">{brand}</div>
      <nav className="ui-navbar__nav">{children}</nav>
      <div className="ui-navbar__actions">{actions}</div>
    </header>
  );
}
