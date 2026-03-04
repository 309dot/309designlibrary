import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { TableHeader } from './TableHeader';
import type { TableHeaderDirection } from './TableHeader.types';

const DIRECTIONS: TableHeaderDirection[] = ['left', 'center', 'right'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toTypography(token: {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

export default function TableHeaderPreviewPage() {
  const [direction, setDirection] = useState<TableHeaderDirection>('left');
  const [disabled, setDisabled] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [showSortIcon, setShowSortIcon] = useState(false);
  const [title, setTitle] = useState('Header');

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
              ...toTypography(typography.scale.h3.bold),
            }}
          >
            Table Header Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textBase.staticDarkSecondary,
              ...toTypography(typography.scale.bodyS.regular),
            }}
          >
            Figma Variant(Direction) 및 헤더 보조 요소(checkbox/sort icon) 구성을 검증합니다.
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
            <span>Direction</span>
            <select
              value={direction}
              onChange={(event) => setDirection(event.target.value as TableHeaderDirection)}
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
              {DIRECTIONS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
            <span>Disabled</span>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
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
            <span>Show Checkbox</span>
            <input
              type="checkbox"
              checked={showCheckbox}
              onChange={(event) => setShowCheckbox(event.target.checked)}
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
              backgroundColor: showCheckbox ? palette.base.white : palette.gray['2'],
            }}
          >
            <span>Checkbox Checked</span>
            <input
              type="checkbox"
              checked={checkboxChecked}
              disabled={!showCheckbox}
              onChange={(event) => setCheckboxChecked(event.target.checked)}
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
            <span>Show Sort Icon</span>
            <input
              type="checkbox"
              checked={showSortIcon}
              onChange={(event) => setShowSortIcon(event.target.checked)}
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
            justifyItems: 'start',
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              ...toTypography(typography.scale.h5.semiBold),
            }}
          >
            Selected Variant
          </h2>

          <TableHeader
            direction={direction}
            disabled={disabled}
            title={title}
            showCheckbox={showCheckbox}
            checkboxChecked={checkboxChecked}
            showSortIcon={showSortIcon}
            onCheckboxCheckedChange={setCheckboxChecked}
            onSortClick={() => undefined}
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
              ...toTypography(typography.scale.h5.semiBold),
            }}
          >
            Direction Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['12'] }}>
            {DIRECTIONS.map((item) => (
              <div key={item} style={{ display: 'grid', gap: spacing.scale['4'] }}>
                <span style={{ ...toTypography(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>
                  {toTitle(item)}
                </span>
                <TableHeader
                  direction={item}
                  disabled={disabled}
                  title={title}
                  showCheckbox={showCheckbox}
                  checkboxChecked={checkboxChecked}
                  showSortIcon={showSortIcon}
                  onCheckboxCheckedChange={setCheckboxChecked}
                  onSortClick={() => undefined}
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
