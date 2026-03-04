import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes } from 'react';

export type TooltipSize = 'sm' | 'md' | 'lg';

export type TooltipPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'rightSide'
  | 'leftSide';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  size?: TooltipSize;
  placement?: TooltipPlacement;
  text?: string;
  headline?: string;
  description?: string;
}

export interface TooltipTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  active?: boolean;
  defaultActive?: boolean;
  disabled?: boolean;
  onActiveChange?: (active: boolean) => void;
  showTooltipOnActive?: boolean;
  tooltipProps?: Omit<TooltipProps, 'className' | 'style'>;
  tooltipStyle?: CSSProperties;
}
