import type { AnchorHTMLAttributes, NavHTMLAttributes, ReactNode } from 'react';

export type BreadcrumbsSize = 'sm' | 'md';

export type BreadcrumbsDivider = 'icon' | 'slash';

export type BreadcrumbsVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export interface BreadcrumbsItem {
  key?: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
  disabled?: boolean;
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;
}

export interface BreadcrumbsProps extends Omit<NavHTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbsItem[];
  size?: BreadcrumbsSize;
  divider?: BreadcrumbsDivider;
  forceState?: BreadcrumbsVisualState;
}
