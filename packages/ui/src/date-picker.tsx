import * as React from "react";
import { cn } from "./utils";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        className={cn("ui-input ui-date", className)}
        {...props}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";
