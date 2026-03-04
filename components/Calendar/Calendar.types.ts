import type { HTMLAttributes } from 'react';

export type CalendarType = 'date' | 'dateRange';

export interface CalendarRangeSelection {
  start: Date | null;
  end: Date | null;
}

export interface CalendarMonthChangePayload {
  month: number;
  year: number;
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  type?: CalendarType;
  month?: number;
  year?: number;
  selectedDate?: Date | null;
  selectedRange?: CalendarRangeSelection;
  currentDate?: Date;
  showTimeSelection?: boolean;
  dateTime?: string;
  rangeStartTime?: string;
  rangeEndTime?: string;
  locale?: string;
  disabledDate?: (date: Date) => boolean;
  onSelectDate?: (date: Date) => void;
  onSelectRange?: (range: CalendarRangeSelection) => void;
  onMonthChange?: (payload: CalendarMonthChangePayload) => void;
  onApply?: () => void;
  onCancel?: () => void;
}

export type CalendarDayState = 'default' | 'hover' | 'active' | 'disabled';

export type CalendarRangeDay = 'first' | 'middle' | 'last';
