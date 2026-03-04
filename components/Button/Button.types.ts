import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'destructive'
  | 'destructiveSecondary'
  | 'destructiveTertiary'
  | 'destructiveGhost';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonVisualState = 'default' | 'hover' | 'focus';
export type ButtonType = 'default' | 'iconOnly';
export type ButtonShape = 'rounded' | 'pill';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  shape?: ButtonShape;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  forceState?: ButtonVisualState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
