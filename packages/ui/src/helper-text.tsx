import * as React from "react";
import { cn } from "./utils";

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function HelperText({ className, ...props }: HelperTextProps) {
  return <p className={cn("ui-helper-text", className)} {...props} />;
}
