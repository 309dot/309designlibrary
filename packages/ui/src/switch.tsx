import * as React from "react";
import { cn } from "./utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export function Switch({ className, label, ...props }: SwitchProps) {
  return (
    <label className={cn("ui-switch", className)}>
      <input type="checkbox" className="ui-switch__input" {...props} />
      <span className="ui-switch__track" aria-hidden>
        <span className="ui-switch__thumb" />
      </span>
      {label ? <span className="ui-switch__label">{label}</span> : null}
    </label>
  );
}
