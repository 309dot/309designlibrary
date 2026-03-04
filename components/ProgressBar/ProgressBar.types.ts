import type { HTMLAttributes } from 'react';

export type ProgressBarDirection = 'vertical' | 'horizontal';

export type ProgressBarTarget = 'default' | 'destructive';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export type ProgressBarColor = 'green' | 'blue' | 'red' | 'orange' | 'purple';

export type ProgressBarInteractionState = 'default' | 'hover' | 'focus' | 'disabled';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  direction?: ProgressBarDirection;
  target?: ProgressBarTarget;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  interactionState?: ProgressBarInteractionState;
  progressValue?: number;
  width?: number;
  label?: string;
  optionalLabel?: string;
  helperText?: string;
  showLabel?: boolean;
  showOptionalLabel?: boolean;
  showProgressState?: boolean;
  showTailIcon?: boolean;
  showHelper?: boolean;
  shimmering?: boolean;
  valueText?: string;
}

