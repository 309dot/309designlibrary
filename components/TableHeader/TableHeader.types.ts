import type { CSSProperties } from 'react';

export type TableHeaderDirection = 'left' | 'center' | 'right';

export interface TableHeaderProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  direction?: TableHeaderDirection;
  disabled?: boolean;

  title?: string;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  showSortIcon?: boolean;

  onCheckboxCheckedChange?: (checked: boolean) => void;
  onSortClick?: () => void;
}
