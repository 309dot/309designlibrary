import * as React from "react";
import { cn } from "./utils";

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function List({ className, ...props }: ListProps) {
  return <ul className={cn("ui-list", className)} {...props} />;
}

export function ListItem({ className, ...props }: ListItemProps) {
  return <li className={cn("ui-list__item", className)} {...props} />;
}
