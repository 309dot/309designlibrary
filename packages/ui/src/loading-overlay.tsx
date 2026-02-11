import * as React from "react";
import { cn } from "./utils";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  label?: string;
}

export function LoadingOverlay({
  visible = false,
  label = "로딩 중",
  className,
  ...props
}: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div className={cn("ui-loading", className)} {...props}>
      <div className="ui-loading__spinner" aria-hidden />
      <div className="ui-loading__label">{label}</div>
    </div>
  );
}
