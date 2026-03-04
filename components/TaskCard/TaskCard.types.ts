import type { HTMLAttributes } from 'react';

export type TaskCardState = 'default' | 'hover';

export interface TaskCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  state?: TaskCardState;
  interactive?: boolean;
  headline?: string;
  description?: string;
  caption?: string;
  tags?: string[];
  onClick?: () => void;
}
