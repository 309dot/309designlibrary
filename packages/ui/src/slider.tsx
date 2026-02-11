import * as React from "react";
import { cn } from "./utils";

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        className={cn("ui-slider", className)}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";
