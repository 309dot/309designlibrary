import * as React from "react";
import { cn } from "./utils";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export function Form({ className, ...props }: FormProps) {
  return <form className={cn("ui-form", className)} {...props} />;
}
