import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type InputType = 'default' | 'external' | 'button';

export type InputSize = 'md' | 'xs';

export type InputTarget = 'default' | 'destructive';

export type InputVisualState = 'default' | 'hover' | 'focus' | 'filled' | 'disabled';

export interface InputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  type?: InputType;
  size?: InputSize;
  target?: InputTarget;
  state?: InputVisualState;
  disabled?: boolean;
  label?: string;
  optionalLabel?: string;
  helperText?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  externalLabel?: string;
  buttonLabel?: string;
  leadDropdownLabel?: string;
  tailDropdownLabel?: string;
  badgeLabel?: string;
  showLabel?: boolean;
  showHelper?: boolean;
  showFlag?: boolean;
  showLeadDropdown?: boolean;
  showLeadIcon?: boolean;
  showBadge?: boolean;
  showTailIcon?: boolean;
  showTailDropdown?: boolean;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  inputAriaLabel?: string;
  onValueChange?: (value: string) => void;
  onButtonClick?: () => void;
}
