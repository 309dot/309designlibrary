import * as React from "react";
import { cn } from "./utils";

export interface FieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
}

export function Fieldset({ legend, className, children, ...props }: FieldsetProps) {
  return (
    <fieldset className={cn("ui-fieldset", className)} {...props}>
      {legend ? <legend className="ui-fieldset__legend">{legend}</legend> : null}
      {children}
    </fieldset>
  );
}
