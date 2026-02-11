import * as React from "react";
import { cn } from "./utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className={cn("ui-checkbox", className)}>
      <input type="checkbox" className="ui-checkbox__input" {...props} />
      <span className="ui-checkbox__box" aria-hidden />
      {label ? <span className="ui-checkbox__label">{label}</span> : null}
    </label>
  );
}
