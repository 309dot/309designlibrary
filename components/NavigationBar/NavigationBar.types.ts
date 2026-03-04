import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type NavigationBarType = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';

export type NavigationBarInteractionState = 'default' | 'hover' | 'focus' | 'disabled';

export interface NavigationBarLinkItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badgeText?: string;
  accent?: boolean;
  hasChevron?: boolean;
  disabled?: boolean;
}

export interface NavigationBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  type?: NavigationBarType;
  width?: number;
  interactionState?: NavigationBarInteractionState;
  links?: NavigationBarLinkItem[];
  bottomLinks?: NavigationBarLinkItem[];
  activeBottomLinkId?: string;
  searchPlaceholder?: string;
  searchShortcutLabel?: string;
  ctaLabel?: string;
  helpLabel?: string;
  avatarSrc?: string;
  onLinkClick?: (id: string) => void;
  onCtaClick?: () => void;
  onBottomLinkClick?: (id: string) => void;
}
