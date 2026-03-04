import type { HTMLAttributes } from 'react';

export type PagenationType = 'arrows' | 'numbers' | 'buttons';

export type PagenationSize = 'md' | 'sm';

export type PagenationInteractionState = 'default' | 'hover' | 'focus' | 'disabled';

export interface PagenationNumberItem {
  id: string;
  label: string;
  kind?: 'page' | 'more';
  active?: boolean;
  disabled?: boolean;
}

export interface PagenationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  type?: PagenationType;
  size?: PagenationSize;
  interactionState?: PagenationInteractionState;
  showDots?: boolean;
  dotCount?: number;
  activeDotIndex?: number;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  numberItems?: PagenationNumberItem[];
  onPrevClick?: () => void;
  onNextClick?: () => void;
  onNumberClick?: (id: string) => void;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
}

