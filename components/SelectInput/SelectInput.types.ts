import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type SelectInputSize = 'md' | 'sm';

export type SelectInputTarget = 'default' | 'destructive';

export type SelectInputType = 'default' | 'multi-select' | 'avatar';

export type SelectInputVisualState = 'default' | 'hover' | 'filled' | 'focus' | 'disabled';

export interface SelectInputItem {
  id: string;
  label: string;
  supportText?: string;
  badgeLabel?: string;
  avatarLabel?: string;
  avatarSrc?: string;
}

export interface SelectInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  size?: SelectInputSize;
  target?: SelectInputTarget;
  type?: SelectInputType;
  state?: SelectInputVisualState;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  label?: string;
  optionalLabel?: string;
  helperText?: string;
  placeholder?: string;
  showLabel?: boolean;
  showHelper?: boolean;
  showShortcutBadge?: boolean;
  shortcutLabel?: string;
  showLeadIcon?: boolean;
  showTailIcon?: boolean;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;
  items?: SelectInputItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdChange?: (id: string) => void;
  onSelectedIdsChange?: (ids: string[]) => void;
  onOpenChange?: (open: boolean) => void;
  triggerAriaLabel?: string;
}
