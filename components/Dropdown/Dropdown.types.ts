import type { CSSProperties, ReactNode } from 'react';

export type DropdownVariant = 'base' | 'select' | 'extended';

export type DropdownVisualState = 'default' | 'hover' | 'focus' | 'disabled';

export type DropdownSelectMode = 'single' | 'multiple';

export type DropdownItemType = 'default' | 'avatar';

export type DropdownSize = 'md' | 'lg';

export type DropdownMenuWidth = 'compact' | 'regular' | 'wide';

export type DropdownPosition = 'left' | 'right';

export interface DropdownItem {
  id: string;
  label: string;
  caption?: string;
  supportText?: string;
  badgeLabel?: string;
  avatarText?: string;
  disabled?: boolean;
  state?: DropdownVisualState;
  showLeadingIcon?: boolean;
  showBadge?: boolean;
  showToggle?: boolean;
  showTailIcon?: boolean;
  toggleActive?: boolean;
  onToggleChange?: (active: boolean) => void;
  leadingIcon?: ReactNode;
  tailIcon?: ReactNode;
}

export interface DropdownProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  label?: string;
  variant?: DropdownVariant;
  state?: DropdownVisualState;
  selectMode?: DropdownSelectMode;
  itemType?: DropdownItemType;
  size?: DropdownSize;
  width?: DropdownMenuWidth;
  position?: DropdownPosition;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  showScrollbar?: boolean;
  items?: DropdownItem[];
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: DropdownItem) => void;
}
