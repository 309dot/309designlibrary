import * as React from "react";
import { cn } from "./utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language, className, ...props }: CodeBlockProps) {
  return (
    <pre className={cn("ui-code", className)} {...props}>
      {language ? <span className="ui-code__lang">{language}</span> : null}
      <code>{code}</code>
    </pre>
  );
}
