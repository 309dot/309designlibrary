import * as React from "react";
import { cn } from "./utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("ui-icon-button", `ui-icon-button--${variant}`, className)}
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";
