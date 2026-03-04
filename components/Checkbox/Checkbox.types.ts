import type { CSSProperties } from 'react';

export type CheckboxSize = 'sm' | 'md';

export type CheckboxVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export type CheckboxType = 'default' | 'indeterminate';

export interface CheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  className?: string;
  style?: CSSProperties;
  size?: CheckboxSize;
  type?: CheckboxType;
  checked?: boolean;
  state?: CheckboxVisualState;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;
  ariaLabel?: string;
}
