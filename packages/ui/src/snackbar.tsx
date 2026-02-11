import * as React from "react";
import { cn } from "./utils";

export interface SnackbarProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "bottom" | "top";
}

export function Snackbar({ position = "bottom", className, ...props }: SnackbarProps) {
  return (
    <div className={cn("ui-snackbar", `ui-snackbar--${position}`, className)} {...props} />
  );
}

export interface SnackbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "neutral" | "success" | "warning" | "error" | "info";
}

export function SnackbarItem({ tone = "neutral", className, ...props }: SnackbarItemProps) {
  return (
    <div className={cn("ui-snackbar__item", `ui-snackbar__item--${tone}`, className)} {...props} />
  );
}
