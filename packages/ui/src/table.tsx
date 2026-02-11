import * as React from "react";
import { cn } from "./utils";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return <table className={cn("ui-table", className)} {...props} />;
}
