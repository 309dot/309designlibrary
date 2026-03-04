import type { HTMLAttributes, ReactNode } from 'react';

export type FeatureCardType = 'elevated' | 'flat' | 'custom';

export type FeatureCardAlignment = 'imageFirst' | 'contentFirst';

export interface FeatureCardAction {
  label: string;
  onClick?: () => void;
}

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  type?: FeatureCardType;
  alignment?: FeatureCardAlignment;
  badgeLabel?: string;
  headline?: string;
  description?: string;
  primaryAction?: FeatureCardAction;
  secondaryAction?: FeatureCardAction;
  showBadge?: boolean;
  showActions?: boolean;
  imageSlot?: ReactNode;
  customSlot?: ReactNode;
}
