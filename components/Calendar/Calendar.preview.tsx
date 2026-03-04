import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Calendar } from './Calendar';
import type { CalendarRangeSelection, CalendarType } from './Calendar.types';

const TYPES: CalendarType[] = ['date', 'dateRange'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createDate(year: number, month: number, date: number): Date {
  return new Date(year, month, date);
}

export default function CalendarPreviewPage() {
  const [type, setType] = useState<CalendarType>('date');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [showTimeSelection, setShowTimeSelection] = useState(true);
  const [disableWeekends, setDisableWeekends] = useState(false);
  const [highlightCurrentDate, setHighlightCurrentDate] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(createDate(2024, 1, 2));
  const [selectedRange, setSelectedRange] = useState<CalendarRangeSelection>({
    start: createDate(2024, 1, 2),
    end: createDate(2024, 1, 7),
  });

  const currentDate = useMemo(
    () => (highlightCurrentDate ? createDate(year, month, 1) : createDate(2000, 0, 1)),
    [highlightCurrentDate, month, year],
  );

  const disabledDate = useMemo(
    () =>
      disableWeekends
        ? (date: Date) => {
            const day = date.getDay();
            return day === 0 || day === 6;
          }
        : undefined,
    [disableWeekends],
  );

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
        backgroundColor: palette.base.white,
        color: textBase.staticDark,
        padding: spacing.scale['24'],
        fontFamily: typography.scale.bodyM.medium.fontFamily,
      }}
    >
      <section
        style={{
          maxWidth: spacing.scale['1024'],
          marginInline: 'auto',
          display: 'grid',
          gap: spacing.scale['24'],
        }}
      >
        <header style={{ display: 'grid', gap: spacing.scale['8'] }}>
          <h1
            style={{
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Calendar Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textBase.staticDarkSecondary,
              fontFamily: typography.scale.bodyS.regular.fontFamily,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma variant(Type=Date/Date Range)와 셀 상태(Default/Hover/Active/Disabled) 상호작용 검증
          </p>
        </header>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.gray['1'],
            padding: spacing.scale['16'],
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as CalendarType)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Month</span>
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {MONTHS.map((item, index) => (
                <option key={item} value={index}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Year</span>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {[2023, 2024, 2025, 2026].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Time Selection</span>
            <input
              type="checkbox"
              checked={showTimeSelection}
              onChange={(event) => setShowTimeSelection(event.target.checked)}
            />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Disable Weekends</span>
            <input
              type="checkbox"
              checked={disableWeekends}
              onChange={(event) => setDisableWeekends(event.target.checked)}
            />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Current Date Accent</span>
            <input
              type="checkbox"
              checked={highlightCurrentDate}
              onChange={(event) => setHighlightCurrentDate(event.target.checked)}
            />
          </label>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.gray['1'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Active Selection
          </h2>

          <Calendar
            type={type}
            month={month}
            year={year}
            currentDate={currentDate}
            showTimeSelection={showTimeSelection}
            selectedDate={selectedDate}
            selectedRange={selectedRange}
            disabledDate={disabledDate}
            onSelectDate={setSelectedDate}
            onSelectRange={setSelectedRange}
          />
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.gray['1'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Variant Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['16'] }}>
            <Calendar
              type="date"
              month={1}
              year={2024}
              currentDate={createDate(2024, 1, 1)}
              showTimeSelection
              selectedDate={createDate(2024, 1, 2)}
            />
            <Calendar
              type="dateRange"
              month={1}
              year={2024}
              currentDate={createDate(2024, 1, 1)}
              showTimeSelection
              selectedRange={{
                start: createDate(2024, 1, 2),
                end: createDate(2024, 1, 7),
              }}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
