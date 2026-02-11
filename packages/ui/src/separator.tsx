import * as React from "react";
import { cn } from "./utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export function Separator({ className, ...props }: SeparatorProps) {
  return <hr className={cn("ui-separator", className)} {...props} />;
}
