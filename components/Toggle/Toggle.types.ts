import type { ButtonHTMLAttributes } from 'react';

export type ToggleSize = 'sm' | 'md';

export type ToggleVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'size' | 'type'> {
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  state?: ToggleVisualState;
  onCheckedChange?: (checked: boolean) => void;
}
