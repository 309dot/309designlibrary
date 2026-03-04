import type { HTMLAttributes } from 'react';

export type ProgressCircleSize = 'xs' | 'sm' | 'md' | 'lg';

export type ProgressCircleColor = 'green' | 'purple' | 'red';

export type ProgressCircleInteractionState = 'default' | 'hover' | 'focus' | 'disabled';

export interface ProgressCircleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  size?: ProgressCircleSize;
  color?: ProgressCircleColor;
  interactionState?: ProgressCircleInteractionState;
  progressValue?: number;
  showLabel?: boolean;
  label?: string;
}

