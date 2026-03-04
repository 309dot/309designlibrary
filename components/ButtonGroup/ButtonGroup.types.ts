import type { HTMLAttributes, ReactNode } from 'react';

export type ButtonGroupSize = 'lg' | 'md' | 'sm';

export type ButtonGroupShape = 'rounded' | 'pill';

export type ButtonGroupItemType = 'default' | 'iconOnly';

export type ButtonGroupItemAlign = 'left' | 'center' | 'right';

export type ButtonGroupItemState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';

export interface ButtonGroupItemData {
  key?: string;
  type?: ButtonGroupItemType;
  align?: ButtonGroupItemAlign;
  state?: ButtonGroupItemState;
  active?: boolean;
  disabled?: boolean;
  label?: string;
  badgeLabel?: string;
  showBadge?: boolean;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  size?: ButtonGroupSize;
  shape?: ButtonGroupShape;
  items: ButtonGroupItemData[];
  forceState?: ButtonGroupItemState;
  onItemClick?: (index: number, item: ButtonGroupItemData) => void;
}

