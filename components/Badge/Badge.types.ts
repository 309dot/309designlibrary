import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeColor =
  | 'gray'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'purple'
  | 'white'
  | 'whiteDestructive'
  | 'surface'
  | 'surfaceDestructive';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export type BadgeShape = 'rounded' | 'pill';

export type BadgeVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  stroke?: boolean;
  disabled?: boolean;
  forceState?: BadgeVisualState;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}
