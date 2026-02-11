import * as React from "react";
import { cn } from "./utils";

export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  active?: boolean;
}

export function NavItem({ href, active, className, children, ...props }: NavItemProps) {
  const classes = cn("ui-nav-item", active && "is-active", className);
  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
