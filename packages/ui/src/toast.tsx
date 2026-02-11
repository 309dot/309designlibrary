import * as React from "react";
import { cn } from "./utils";

export type ToastTone = "neutral" | "success" | "warning" | "error" | "info";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
}

export function Toast({ className, tone = "neutral", ...props }: ToastProps) {
  return <div className={cn("ui-toast", `ui-toast--${tone}`, className)} {...props} />;
}
