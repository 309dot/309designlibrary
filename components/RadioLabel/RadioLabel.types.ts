import type { CSSProperties } from 'react';

import type { RadioVisualState } from '../Radio/Radio.types';

export type RadioLabelSize = 'sm' | 'md';

export type RadioLabelVisualState = RadioVisualState;

export interface RadioLabelProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  size?: RadioLabelSize;
  checked?: boolean;
  state?: RadioLabelVisualState;
  label?: string;
  caption?: string;
  showCaption?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
