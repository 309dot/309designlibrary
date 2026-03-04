import type { HTMLAttributes, ReactNode } from 'react';

export type AccordionSize = 'lg' | 'md';

export type AccordionVisualState = 'default' | 'hover' | 'focused' | 'disabled';

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  title: string;
  description?: string;
  size?: AccordionSize;
  expanded?: boolean;
  defaultExpanded?: boolean;
  disabled?: boolean;
  showLeadingIcon?: boolean;
  leadingIcon?: ReactNode;
  forceState?: AccordionVisualState;
  onExpandedChange?: (expanded: boolean) => void;
}
