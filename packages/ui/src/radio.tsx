import * as React from "react";
import { cn } from "./utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export function Radio({ className, label, ...props }: RadioProps) {
  return (
    <label className={cn("ui-radio", className)}>
      <input type="radio" className="ui-radio__input" {...props} />
      <span className="ui-radio__dot" aria-hidden />
      {label ? <span className="ui-radio__label">{label}</span> : null}
    </label>
  );
}
