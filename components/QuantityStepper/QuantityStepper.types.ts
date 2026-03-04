import type { HTMLAttributes } from 'react';

export type QuantityStepperSize = 'lg' | 'md';

export type QuantityStepperShape = 'rounded' | 'pill';

export type QuantityStepperState = 'default' | 'hover' | 'focused' | 'disabled';

export interface QuantityStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  size?: QuantityStepperSize;
  shape?: QuantityStepperShape;
  state?: QuantityStepperState;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  decreaseAriaLabel?: string;
  increaseAriaLabel?: string;
  onValueChange?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onIncrease?: (value: number) => void;
}

