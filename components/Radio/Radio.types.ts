import type { CSSProperties } from 'react';

export type RadioSize = 'sm' | 'md';

export type RadioVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export interface RadioProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  style?: CSSProperties;
  size?: RadioSize;
  checked?: boolean;
  state?: RadioVisualState;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;
  ariaLabel?: string;
}
