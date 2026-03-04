import type { CSSProperties, ReactNode } from 'react';

export type TableCellType =
  | 'leadPrimary'
  | 'text'
  | 'button'
  | 'circleCheckbox'
  | 'checkbox'
  | 'radioButton'
  | 'buttonGroup'
  | 'toggle'
  | 'badge'
  | 'badgeGroup'
  | 'avatar'
  | 'avatarGroup'
  | 'progress'
  | 'chart';

export type TableCellSize = 'lg' | 'md' | 'sm';

export type TableCellDirection = 'left' | 'center' | 'right';

export type TableCellBadgeTone = 'blue' | 'green' | 'gray';

export type TableCellAvatarTone = 'blue' | 'purple' | 'orange' | 'gray';

export interface TableCellBadgeItem {
  label: string;
  tone?: TableCellBadgeTone;
}

export interface TableCellAvatarItem {
  id: string;
  label?: string;
  tone?: TableCellAvatarTone;
  imageSrc?: string;
}

export interface TableCellProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  type?: TableCellType;
  size?: TableCellSize;
  direction?: TableCellDirection;
  disabled?: boolean;

  title?: string;
  caption?: string;
  showCaption?: boolean;

  showLeadIcon?: boolean;
  showTailButton?: boolean;
  showAvatar?: boolean;
  leadIcon?: ReactNode;
  tailIcon?: ReactNode;

  checked?: boolean;
  radioChecked?: boolean;
  toggleChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onRadioCheckedChange?: (checked: boolean) => void;
  onToggleCheckedChange?: (checked: boolean) => void;

  buttonIcon?: ReactNode;
  buttonGroupPrimaryIcon?: ReactNode;
  buttonGroupSecondaryIcon?: ReactNode;

  badgeLabel?: string;
  badges?: TableCellBadgeItem[];

  avatarLabel?: string;
  avatarSrc?: string;
  avatars?: TableCellAvatarItem[];
  avatarOverflowLabel?: string;

  progressValue?: number;
  progressLabel?: string;
  chartPoints?: number[];
}
