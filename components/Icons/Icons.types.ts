import type { CSSProperties, FocusEvent, MouseEvent, MouseEventHandler } from 'react';

export const ICON_TYPE_OPTIONS = ['line', 'fill'] as const;
export const ICON_VISUAL_STATE_OPTIONS = ['default', 'hover', 'focus', 'disabled'] as const;
export const ICON_SIZE_OPTIONS = ['14', '16', '20', '24'] as const;
export const ICON_TONE_OPTIONS = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'inverted',
  'invertedSecondary',
  'invertedTertiary',
  'invertedQuaternary',
  'success',
  'warning',
  'destructive',
  'info',
] as const;

export type IconType = (typeof ICON_TYPE_OPTIONS)[number];
export type IconVisualState = (typeof ICON_VISUAL_STATE_OPTIONS)[number];
export type IconSizeToken = (typeof ICON_SIZE_OPTIONS)[number];
export type IconTone = (typeof ICON_TONE_OPTIONS)[number];
export type IconName = string;

export interface IconsProps {
  name: IconName;
  type?: IconType;
  size?: IconSizeToken;
  tone?: IconTone;
  state?: IconVisualState;
  decorative?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  iconStyle?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
}
