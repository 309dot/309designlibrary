import * as React from "react";
import { cn } from "./utils";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

export function Alert({ tone = "neutral", title, className, ...props }: AlertProps) {
  return (
    <div className={cn("ui-alert", `ui-alert--${tone}`, className)} {...props}>
      {title ? <div className="ui-alert__title">{title}</div> : null}
      <div className="ui-alert__body">{props.children}</div>
    </div>
  );
}
