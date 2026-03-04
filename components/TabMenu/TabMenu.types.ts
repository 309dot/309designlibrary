import type { HTMLAttributes } from 'react';

export type TabMenuType = 'fill' | 'line' | 'segmented';

export type TabMenuSize = 'lg' | 'md' | 'sm';

export type TabMenuVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export interface TabMenuItem {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
  state?: TabMenuVisualState;
}

export interface TabMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type?: TabMenuType;
  size?: TabMenuSize;
  items?: TabMenuItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  forceItemState?: TabMenuVisualState;
  disabled?: boolean;
  onSelectedIdChange?: (id: string) => void;
}
