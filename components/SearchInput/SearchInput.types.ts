import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type SearchInputState = 'default' | 'filled' | 'disabled';

export interface SearchInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  state?: SearchInputState;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  badgeLabel?: string;
  showLeadIcon?: boolean;
  showTailIcon?: boolean;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  inputAriaLabel?: string;
  onValueChange?: (value: string) => void;
}
