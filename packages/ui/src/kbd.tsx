import * as React from "react";
import { cn } from "./utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn("ui-kbd", className)} {...props} />;
}
