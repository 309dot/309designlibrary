import * as React from "react";
import { cn } from "./utils";

export interface ErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function ErrorText({ className, ...props }: ErrorTextProps) {
  return <p className={cn("ui-error-text", className)} {...props} />;
}
