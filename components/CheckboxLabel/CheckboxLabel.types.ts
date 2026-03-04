import type { CSSProperties } from 'react';

import type { CheckboxVisualState } from '../Checkbox/Checkbox.types';

export type CheckboxLabelSize = 'sm' | 'md';

export type CheckboxLabelType = 'default' | 'checked' | 'indeterminate';

export interface CheckboxLabelProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  size?: CheckboxLabelSize;
  type?: CheckboxLabelType;
  state?: CheckboxVisualState;
  label?: string;
  caption?: string;
  showCaption?: boolean;
  disabled?: boolean;
  onTypeChange?: (type: CheckboxLabelType) => void;
}
