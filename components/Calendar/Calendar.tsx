import React, { useEffect, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type {
  CalendarDayState,
  CalendarMonthChangePayload,
  CalendarProps,
  CalendarRangeDay,
  CalendarRangeSelection,
  CalendarType,
} from './Calendar.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type CalendarDayCell = {
  key: string;
  date: Date;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

const CALENDAR_WIDTH = spacing.scale['288'] - spacing.scale['4'];
const DATE_CELL_SIZE = spacing.scale['36'];
const DATE_CELL_INSET = spacing.scale['2'];
const RANGE_FILL_HEIGHT = spacing.scale['32'];
const RANGE_FILL_EDGE = spacing.scale['2'];
const HEADER_ICON_SIZE = spacing.scale['20'];

const ARROW_LEFT_PATH = 'M2.35667 5.30333L6.48167 9.42833L5.30333 10.6067L0 5.30333L5.30333 0L6.48167 1.17833L2.35667 5.30333Z';
const ARROW_RIGHT_PATH = 'M4.125 5.30333L0 1.17833L1.17833 0L6.48167 5.30333L1.17833 10.6067L0 9.42833L4.125 5.30333Z';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;
const textAccent = colors.semantic.theme.text.accent;

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function atStartOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function areSameDate(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function compareDate(a: Date, b: Date): number {
  const aTime = atStartOfDay(a).getTime();
  const bTime = atStartOfDay(b).getTime();

  if (aTime === bTime) {
    return 0;
  }

  return aTime < bTime ? -1 : 1;
}

function normalizeRange(range: CalendarRangeSelection): CalendarRangeSelection {
  if (!range.start || !range.end) {
    return range;
  }

  return compareDate(range.start, range.end) <= 0
    ? range
    : {
        start: range.end,
        end: range.start,
      };
}

function isWithinRange(date: Date, range: CalendarRangeSelection): boolean {
  if (!range.start || !range.end) {
    return false;
  }

  const target = atStartOfDay(date).getTime();
  const start = atStartOfDay(range.start).getTime();
  const end = atStartOfDay(range.end).getTime();

  return target >= start && target <= end;
}

function getRangeDayPosition(date: Date, range: CalendarRangeSelection): CalendarRangeDay {
  if (!range.start || !range.end) {
    return 'middle';
  }

  if (areSameDate(range.start, range.end)) {
    return 'first';
  }

  if (areSameDate(date, range.start)) {
    return 'first';
  }

  if (areSameDate(date, range.end)) {
    return 'last';
  }

  return 'middle';
}

function formatMonthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${month}/${day}/${year}`;
}

function buildMonthGrid(year: number, month: number): CalendarDayCell[][] {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = firstDayOfMonth.getDay();
  const monthLength = new Date(year, month + 1, 0).getDate();
  const previousMonthLength = new Date(year, month, 0).getDate();

  const entries: CalendarDayCell[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    const day = previousMonthLength - firstWeekday + index + 1;
    const date = new Date(year, month - 1, day);
    entries.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= monthLength; day += 1) {
    const date = new Date(year, month, day);
    entries.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inCurrentMonth: true,
    });
  }

  while (entries.length % WEEKDAY_LABELS.length !== 0) {
    const offset = entries.length - (firstWeekday + monthLength) + 1;
    const date = new Date(year, month + 1, offset);
    entries.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inCurrentMonth: false,
    });
  }

  const weeks: CalendarDayCell[][] = [];
  for (let start = 0; start < entries.length; start += WEEKDAY_LABELS.length) {
    weeks.push(entries.slice(start, start + WEEKDAY_LABELS.length));
  }

  return weeks;
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 6.48167 10.6067"
      style={{
        width: HEADER_ICON_SIZE,
        height: HEADER_ICON_SIZE,
        display: 'block',
        color: textBase.staticDarkSecondary,
      }}
    >
      <path d={direction === 'left' ? ARROW_LEFT_PATH : ARROW_RIGHT_PATH} fill="currentColor" />
    </svg>
  );
}

function FooterField({ label, value, showLabel }: { label: string; value: string; showLabel: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 0 0',
        minWidth: spacing.scale['144'],
        minHeight: spacing.scale['0'],
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['8'],
      }}
    >
      {showLabel ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.scale['0'],
            padding: spacing.scale['0'],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.scale['4'],
              paddingInline: spacing.scale['0'],
              paddingBlock: spacing.scale['2'],
            }}
          >
            <span
              style={{
                color: textBase.staticDark,
                ...toTypographyStyle(typography.scale.captionL.medium),
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.scale['0'],
          boxShadow: shadows.elevation.xs.css,
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            alignItems: 'center',
            gap: spacing.scale['0'],
            minWidth: spacing.scale['0'],
            minHeight: spacing.scale['0'],
            paddingInline: spacing.scale['8'],
            paddingBlock: spacing.scale['6'],
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.lg,
            backgroundColor: palette.base.white,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: '1 0 0',
              alignItems: 'center',
              gap: spacing.scale['4'],
              minWidth: spacing.scale['0'],
              minHeight: spacing.scale['0'],
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: '1 0 0',
                alignItems: 'center',
                gap: spacing.scale['2'],
                minWidth: spacing.scale['0'],
                minHeight: spacing.scale['0'],
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: '1 0 0',
                  alignItems: 'center',
                  gap: spacing.scale['0'],
                  minWidth: spacing.scale['0'],
                  minHeight: spacing.scale['0'],
                  paddingInline: spacing.scale['4'],
                  paddingBlock: spacing.scale['0'],
                }}
              >
                <span
                  style={{
                    color: textBase.staticDark,
                    ...toTypographyStyle(typography.scale.captionL.regular),
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  appearance,
  onClick,
}: {
  label: string;
  appearance: 'primary' | 'secondary';
  onClick?: () => void;
}) {
  const isPrimary = appearance === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flex: '1 0 0',
        height: spacing.scale['32'],
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.scale['2'],
        minWidth: spacing.scale['0'],
        minHeight: spacing.scale['0'],
        paddingInline: spacing.scale['10'],
        paddingBlock: spacing.scale['6'],
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: isPrimary ? palette.gray['13'] : palette.gray['3'],
        borderRadius: radius.scale.lg,
        backgroundColor: isPrimary ? palette.gray['13'] : palette.base.white,
        color: isPrimary ? palette.base.white : textBase.staticDark,
        boxShadow: shadows.elevation.xs.css,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: spacing.scale['4'],
          paddingBlock: spacing.scale['0'],
          ...toTypographyStyle(typography.scale.captionL.medium),
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function CalendarFooter({
  type,
  showTimeSelection,
  selectedDate,
  selectedRange,
  dateTime,
  rangeStartTime,
  rangeEndTime,
  onCancel,
  onApply,
}: {
  type: CalendarType;
  showTimeSelection: boolean;
  selectedDate: Date | null;
  selectedRange: CalendarRangeSelection;
  dateTime: string;
  rangeStartTime: string;
  rangeEndTime: string;
  onCancel?: () => void;
  onApply?: () => void;
}) {
  const dateValue = selectedDate ? formatDateInput(selectedDate) : '--/--/----';
  const rangeStartValue = selectedRange.start ? formatDateInput(selectedRange.start) : '--/--/----';
  const rangeEndValue = selectedRange.end ? formatDateInput(selectedRange.end) : '--/--/----';

  if (type === 'date') {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['16'],
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: spacing.scale['8'],
          }}
        >
          <FooterField label="Date" value={dateValue} showLabel />
          {showTimeSelection ? <FooterField label="Time" value={dateTime} showLabel /> : null}
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.scale['8'],
          }}
        >
          <ActionButton label="Cancel" appearance="secondary" onClick={onCancel} />
          <ActionButton label="Apply" appearance="primary" onClick={onApply} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['16'],
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['8'],
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: spacing.scale['8'],
          }}
        >
          <FooterField label="Start" value={rangeStartValue} showLabel />
          {showTimeSelection ? <FooterField label="Time" value={rangeStartTime} showLabel={false} /> : null}
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: spacing.scale['8'],
          }}
        >
          <FooterField label="End" value={rangeEndValue} showLabel />
          {showTimeSelection ? <FooterField label="Time" value={rangeEndTime} showLabel={false} /> : null}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.scale['8'],
        }}
      >
        <ActionButton label="Cancel" appearance="secondary" onClick={onCancel} />
        <ActionButton label="Apply" appearance="primary" onClick={onApply} />
      </div>
    </div>
  );
}

export function Calendar({
  type = 'date',
  month,
  year,
  selectedDate,
  selectedRange,
  currentDate = new Date(),
  showTimeSelection = true,
  dateTime = '10:39 PM',
  rangeStartTime = '10:39 PM',
  rangeEndTime = '09:12 AM',
  locale = 'en-US',
  disabledDate,
  onSelectDate,
  onSelectRange,
  onMonthChange,
  onApply,
  onCancel,
  className,
  style,
  ...props
}: CalendarProps) {
  const fallbackViewDate = useMemo(() => atStartOfDay(currentDate), [currentDate]);
  const [viewMonth, setViewMonth] = useState(month ?? fallbackViewDate.getMonth());
  const [viewYear, setViewYear] = useState(year ?? fallbackViewDate.getFullYear());

  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate ?? null);
  const [internalSelectedRange, setInternalSelectedRange] = useState<CalendarRangeSelection>(
    selectedRange ?? {
      start: null,
      end: null,
    },
  );

  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof month === 'number') {
      setViewMonth(month);
    }
  }, [month]);

  useEffect(() => {
    if (typeof year === 'number') {
      setViewYear(year);
    }
  }, [year]);

  useEffect(() => {
    if (selectedDate !== undefined) {
      setInternalSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRange !== undefined) {
      setInternalSelectedRange(selectedRange);
    }
  }, [selectedRange]);

  const resolvedDate = selectedDate !== undefined ? selectedDate : internalSelectedDate;
  const resolvedRange = normalizeRange(selectedRange !== undefined ? selectedRange : internalSelectedRange);

  const rangePreview = useMemo(() => {
    if (type !== 'dateRange') {
      return null;
    }

    if (!resolvedRange.start || resolvedRange.end || !hoverDate) {
      return null;
    }

    return normalizeRange({
      start: resolvedRange.start,
      end: hoverDate,
    });
  }, [hoverDate, resolvedRange, type]);

  const displayedRange = useMemo(() => {
    if (rangePreview) {
      return rangePreview;
    }

    if (type === 'dateRange' && resolvedRange.start && !resolvedRange.end) {
      return {
        start: resolvedRange.start,
        end: resolvedRange.start,
      };
    }

    return resolvedRange;
  }, [rangePreview, resolvedRange, type]);
  const weeks = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewMonth, viewYear]);
  const monthLabel = useMemo(() => formatMonthLabel(new Date(viewYear, viewMonth, 1), locale), [locale, viewMonth, viewYear]);

  const handleMonthShift = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -1 : 1;
    const shifted = new Date(viewYear, viewMonth + offset, 1);
    const payload: CalendarMonthChangePayload = {
      month: shifted.getMonth(),
      year: shifted.getFullYear(),
    };

    setViewMonth(payload.month);
    setViewYear(payload.year);
    onMonthChange?.(payload);
  };

  const commitDateSelection = (value: Date) => {
    if (selectedDate === undefined) {
      setInternalSelectedDate(value);
    }

    onSelectDate?.(value);
  };

  const commitRangeSelection = (value: CalendarRangeSelection) => {
    const normalized = normalizeRange(value);

    if (selectedRange === undefined) {
      setInternalSelectedRange(normalized);
    }

    onSelectRange?.(normalized);
  };

  const handleDateClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }

    const nextDate = atStartOfDay(date);

    if (type === 'date') {
      commitDateSelection(nextDate);
      return;
    }

    const range = normalizeRange(resolvedRange);

    if (!range.start || range.end) {
      commitRangeSelection({
        start: nextDate,
        end: null,
      });
      return;
    }

    if (compareDate(nextDate, range.start) < 0) {
      commitRangeSelection({
        start: nextDate,
        end: range.start,
      });
      return;
    }

    commitRangeSelection({
      start: range.start,
      end: nextDate,
    });
  };

  return (
    <section
      className={className}
      style={{
        width: CALENDAR_WIDTH,
        maxWidth: spacing.scale['480'],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['12'],
        padding: spacing.scale['12'],
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: palette.gray['3'],
        borderRadius: radius.scale.xl,
        backgroundColor: palette.base.white,
        boxShadow: shadows.elevation.lg.css,
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale['12'],
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            minWidth: spacing.scale['0'],
            minHeight: spacing.scale['0'],
            alignItems: 'flex-start',
            gap: spacing.scale['0'],
            padding: spacing.scale['0'],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.scale['4'],
              paddingInline: spacing.scale['0'],
              paddingBlock: spacing.scale['2'],
            }}
          >
            <span
              style={{
                color: textBase.staticDark,
                ...toTypographyStyle(typography.scale.captionL.medium),
                whiteSpace: 'nowrap',
              }}
            >
              {monthLabel}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.scale['8'],
          }}
        >
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => handleMonthShift('prev')}
            style={{
              width: HEADER_ICON_SIZE,
              height: HEADER_ICON_SIZE,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: palette.base.transparent,
              borderStyle: 'solid',
              borderWidth: border.width['0'],
              borderColor: palette.base.transparent,
              padding: spacing.scale['0'],
              margin: spacing.scale['0'],
              cursor: 'pointer',
            }}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => handleMonthShift('next')}
            style={{
              width: HEADER_ICON_SIZE,
              height: HEADER_ICON_SIZE,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: palette.base.transparent,
              borderStyle: 'solid',
              borderWidth: border.width['0'],
              borderColor: palette.base.transparent,
              padding: spacing.scale['0'],
              margin: spacing.scale['0'],
              cursor: 'pointer',
            }}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </header>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['4'],
        }}
        onMouseLeave={() => {
          if (type === 'dateRange') {
            setHoverDate(null);
          }
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${WEEKDAY_LABELS.length}, minmax(0, 1fr))`,
          }}
        >
          {WEEKDAY_LABELS.map((label, index) => (
            <div
              key={`${label}-${index}`}
              style={{
                display: 'flex',
                flex: '1 0 0',
                minWidth: spacing.scale['0'],
                minHeight: spacing.scale['0'],
                height: spacing.scale['32'],
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.scale.md,
                backgroundColor: palette.base.transparent,
              }}
            >
              <span
                style={{
                  color: textBase.staticDarkSecondary,
                  ...toTypographyStyle(typography.scale.captionM.regular),
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {weeks.map((week) => (
            <div
              key={week.map((day) => day.key).join('|')}
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(${WEEKDAY_LABELS.length}, minmax(0, 1fr))`,
              }}
            >
              {week.map((day) => {
                const outOfMonth = !day.inCurrentMonth;
                const disabledByRule = disabledDate?.(day.date) ?? false;
                const isDisabled = outOfMonth || disabledByRule;
                const isCurrentDate = areSameDate(day.date, currentDate);
                const dateKey = day.key;

                let state: CalendarDayState = 'default';
                let rangeDay: CalendarRangeDay = 'middle';

                if (type === 'date') {
                  if (areSameDate(day.date, resolvedDate)) {
                    state = 'active';
                  }
                } else {
                  const inRange = isWithinRange(day.date, displayedRange);
                  if (inRange) {
                    state = rangePreview ? 'hover' : 'active';
                    rangeDay = getRangeDayPosition(day.date, displayedRange);
                  }
                }

                if (isDisabled) {
                  state = 'disabled';
                }

                const isFocused = focusedKey === dateKey;
                const shouldRenderRangeFill = type === 'dateRange' && (state === 'hover' || state === 'active');
                const isRangeEdge = type === 'dateRange' && (rangeDay === 'first' || rangeDay === 'last');
                const isRangeMiddle = type === 'dateRange' && rangeDay === 'middle';

                const textColor = (() => {
                  if (state === 'disabled') {
                    return textBase.staticDarkQuaternary;
                  }

                  if (isCurrentDate) {
                    return textAccent.purpleAccent;
                  }

                  if (state === 'active' && type === 'date') {
                    return textBase.staticDark;
                  }

                  if (isRangeEdge && (state === 'active' || state === 'hover')) {
                    return textBase.staticDark;
                  }

                  return textBase.staticDarkSecondary;
                })();

                const innerBackgroundColor = (() => {
                  if (type === 'date' && state === 'active') {
                    return palette.base.white;
                  }

                  if (isRangeEdge && (state === 'active' || state === 'hover')) {
                    return palette.base.white;
                  }

                  return palette.base.transparent;
                })();

                const innerBorderWidth = (() => {
                  if (type === 'date' && state === 'active') {
                    return border.width['1'];
                  }

                  if (isRangeEdge && (state === 'active' || state === 'hover')) {
                    return border.width['1'];
                  }

                  return border.width['0'];
                })();

                const innerBorderColor = palette.purple['8'];

                const innerRadius = (() => {
                  if (type === 'date') {
                    return {
                      borderTopLeftRadius: radius.scale.md,
                      borderTopRightRadius: radius.scale.md,
                      borderBottomRightRadius: radius.scale.md,
                      borderBottomLeftRadius: radius.scale.md,
                    };
                  }

                  if (isRangeMiddle && (state === 'active' || state === 'hover')) {
                    return {
                      borderTopLeftRadius: radius.scale['0'],
                      borderTopRightRadius: radius.scale['0'],
                      borderBottomRightRadius: radius.scale['0'],
                      borderBottomLeftRadius: radius.scale['0'],
                    };
                  }

                  if (rangeDay === 'first' && (state === 'active' || state === 'hover')) {
                    return {
                      borderTopLeftRadius: radius.scale.md,
                      borderTopRightRadius: radius.scale['0'],
                      borderBottomRightRadius: radius.scale['0'],
                      borderBottomLeftRadius: radius.scale.md,
                    };
                  }

                  if (rangeDay === 'last' && (state === 'active' || state === 'hover')) {
                    return {
                      borderTopLeftRadius: radius.scale['0'],
                      borderTopRightRadius: radius.scale.md,
                      borderBottomRightRadius: radius.scale.md,
                      borderBottomLeftRadius: radius.scale['0'],
                    };
                  }

                  return {
                    borderTopLeftRadius: radius.scale.md,
                    borderTopRightRadius: radius.scale.md,
                    borderBottomRightRadius: radius.scale.md,
                    borderBottomLeftRadius: radius.scale.md,
                  };
                })();

                const fillStyle = (() => {
                  if (!shouldRenderRangeFill) {
                    return null;
                  }

                  if (rangeDay === 'first') {
                    return {
                      left: RANGE_FILL_EDGE,
                      right: spacing.scale['0'],
                      borderTopLeftRadius: radius.scale.md,
                      borderBottomLeftRadius: radius.scale.md,
                      borderTopRightRadius: radius.scale['0'],
                      borderBottomRightRadius: radius.scale['0'],
                    };
                  }

                  if (rangeDay === 'last') {
                    return {
                      left: spacing.scale['0'],
                      right: RANGE_FILL_EDGE,
                      borderTopLeftRadius: radius.scale['0'],
                      borderBottomLeftRadius: radius.scale['0'],
                      borderTopRightRadius: radius.scale.md,
                      borderBottomRightRadius: radius.scale.md,
                    };
                  }

                  return {
                    left: spacing.scale['0'],
                    right: spacing.scale['0'],
                    borderTopLeftRadius: radius.scale['0'],
                    borderBottomLeftRadius: radius.scale['0'],
                    borderTopRightRadius: radius.scale['0'],
                    borderBottomRightRadius: radius.scale['0'],
                  };
                })();

                return (
                  <button
                    key={dateKey}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDateClick(day.date, isDisabled)}
                    onMouseEnter={() => {
                      if (type === 'dateRange' && resolvedRange.start && !resolvedRange.end && !isDisabled) {
                        setHoverDate(day.date);
                      }
                    }}
                    onFocus={() => setFocusedKey(dateKey)}
                    onBlur={() => setFocusedKey((previous) => (previous === dateKey ? null : previous))}
                    style={{
                      position: 'relative',
                      width: DATE_CELL_SIZE,
                      height: DATE_CELL_SIZE,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      padding: DATE_CELL_INSET,
                      margin: spacing.scale['0'],
                      backgroundColor: palette.base.transparent,
                      borderStyle: 'solid',
                      borderWidth: border.width['0'],
                      borderColor: palette.base.transparent,
                      cursor: isDisabled ? 'default' : 'pointer',
                      boxShadow: isFocused ? shadows.focusRing.light.css : 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {fillStyle ? (
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: `calc(50% - ${RANGE_FILL_HEIGHT / 2}px)`,
                          height: RANGE_FILL_HEIGHT,
                          backgroundColor: palette.gray['1a'],
                          ...fillStyle,
                        }}
                      />
                    ) : null}

                    <span
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flex: '1 0 0',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: spacing.scale['0'],
                        minHeight: spacing.scale['0'],
                        borderStyle: 'solid',
                        borderWidth: innerBorderWidth,
                        borderColor: innerBorderColor,
                        backgroundColor: innerBackgroundColor,
                        ...innerRadius,
                        boxSizing: 'border-box',
                      }}
                    >
                      <span
                        style={{
                          width: '100%',
                          color: textColor,
                          ...toTypographyStyle(typography.scale.captionL.regular),
                          textAlign: 'center',
                        }}
                      >
                        {day.date.getDate()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <CalendarFooter
        type={type}
        showTimeSelection={showTimeSelection}
        selectedDate={resolvedDate}
        selectedRange={resolvedRange}
        dateTime={dateTime}
        rangeStartTime={rangeStartTime}
        rangeEndTime={rangeEndTime}
        onCancel={onCancel}
        onApply={onApply}
      />
    </section>
  );
}
