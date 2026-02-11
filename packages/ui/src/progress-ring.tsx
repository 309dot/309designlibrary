import * as React from "react";
import { cn } from "./utils";

export interface ProgressRingProps extends React.SVGProps<SVGSVGElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  value,
  size = 44,
  strokeWidth = 4,
  className,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={cn("ui-ring", className)}
      {...props}
    >
      <circle
        className="ui-ring__track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="ui-ring__bar"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
