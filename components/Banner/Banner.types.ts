import type { HTMLAttributes, ReactNode } from 'react';

export type BannerDirection = 'horizontal' | 'vertical';

export type BannerState = 'default' | 'hover';

export interface BannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  direction?: BannerDirection;
  state?: BannerState;
  interactive?: boolean;
  badgeLabel?: string;
  headline?: string;
  description?: string;
  showBadge?: boolean;
  imageSlot?: ReactNode;
}
