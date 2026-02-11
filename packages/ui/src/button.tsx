import * as React from "react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        className={cn(
          "ui-button",
          `ui-button--${variant}`,
          `ui-button--${size}`,
          loading && "is-loading",
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        <span className="ui-button__label">{children}</span>
        {loading ? <span className="ui-button__spinner" aria-hidden /> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
