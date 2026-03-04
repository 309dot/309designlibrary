import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { TableCell } from './TableCell';
import type { TableCellDirection, TableCellSize, TableCellType } from './TableCell.types';

const TYPES: TableCellType[] = [
  'leadPrimary',
  'text',
  'button',
  'circleCheckbox',
  'checkbox',
  'radioButton',
  'buttonGroup',
  'toggle',
  'badge',
  'badgeGroup',
  'avatar',
  'avatarGroup',
  'progress',
  'chart',
];

const SIZES: TableCellSize[] = ['lg', 'md', 'sm'];
const DIRECTIONS: TableCellDirection[] = ['left', 'center', 'right'];

const HUNDRED = spacing.scale['40'] + spacing.scale['40'] + spacing.scale['20'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  if (value === 'leadPrimary') {
    return 'Lead [Primary]';
  }

  if (value === 'circleCheckbox') {
    return 'Circle checkbox';
  }

  if (value === 'radioButton') {
    return 'Radio button';
  }

  if (value === 'buttonGroup') {
    return 'Button group';
  }

  if (value === 'badgeGroup') {
    return 'Badge group';
  }

  if (value === 'avatarGroup') {
    return 'Avatar group';
  }

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

export default function TableCellPreviewPage() {
  const [type, setType] = useState<TableCellType>('leadPrimary');
  const [size, setSize] = useState<TableCellSize>('md');
  const [direction, setDirection] = useState<TableCellDirection>('left');
  const [disabled, setDisabled] = useState(false);

  const [showLeadIcon, setShowLeadIcon] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showTailButton, setShowTailButton] = useState(true);
  const [showCaption, setShowCaption] = useState(true);

  const [checked, setChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const [toggleChecked, setToggleChecked] = useState(false);
  const [progressValue, setProgressValue] = useState(spacing.scale['48'] + spacing.scale['2']);

  const showLeadOptions = type === 'leadPrimary';
  const showTextOptions = type === 'text';
  const showCheckboxOptions = type === 'checkbox' || type === 'circleCheckbox';
  const showRadioOptions = type === 'radioButton';
  const showToggleOptions = type === 'toggle';
  const showProgressOptions = type === 'progress';

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
            Table Cell Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textBase.staticDarkSecondary,
              ...toTypography(typography.scale.bodyS.regular),
            }}
          >
            Figma Variant(Type/Size/Direction)와 셀 내부 토큰 구성을 검증합니다.
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
              onChange={(event) => setType(event.target.value as TableCellType)}
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
            <span>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as TableCellSize)}
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
              {SIZES.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Direction</span>
            <select
              value={direction}
              onChange={(event) => setDirection(event.target.value as TableCellDirection)}
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

          {showLeadOptions ? (
            <>
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
                <span>Lead Icon</span>
                <input
                  type="checkbox"
                  checked={showLeadIcon}
                  onChange={(event) => setShowLeadIcon(event.target.checked)}
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
                <span>Avatar</span>
                <input
                  type="checkbox"
                  checked={showAvatar}
                  onChange={(event) => setShowAvatar(event.target.checked)}
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
                <span>Tail Button</span>
                <input
                  type="checkbox"
                  checked={showTailButton}
                  onChange={(event) => setShowTailButton(event.target.checked)}
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
                <span>Caption</span>
                <input
                  type="checkbox"
                  checked={showCaption}
                  onChange={(event) => setShowCaption(event.target.checked)}
                />
              </label>
            </>
          ) : null}

          {showTextOptions ? (
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
              <span>Caption</span>
              <input
                type="checkbox"
                checked={showCaption}
                onChange={(event) => setShowCaption(event.target.checked)}
              />
            </label>
          ) : null}

          {showCheckboxOptions ? (
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
              <span>Checked</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
            </label>
          ) : null}

          {showRadioOptions ? (
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
              <span>Checked</span>
              <input
                type="checkbox"
                checked={radioChecked}
                onChange={(event) => setRadioChecked(event.target.checked)}
              />
            </label>
          ) : null}

          {showToggleOptions ? (
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
              <span>Checked</span>
              <input
                type="checkbox"
                checked={toggleChecked}
                onChange={(event) => setToggleChecked(event.target.checked)}
              />
            </label>
          ) : null}

          {showProgressOptions ? (
            <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
              <span>Progress ({Math.round(progressValue)}%)</span>
              <input
                type="range"
                min={spacing.scale['0']}
                max={HUNDRED}
                step={spacing.scale['10']}
                value={progressValue}
                onChange={(event) => setProgressValue(Number(event.target.value))}
              />
            </label>
          ) : null}
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

          <TableCell
            type={type}
            size={size}
            direction={direction}
            disabled={disabled}
            showLeadIcon={showLeadIcon}
            showAvatar={showAvatar}
            showTailButton={showTailButton}
            showCaption={showCaption}
            checked={checked}
            radioChecked={radioChecked}
            toggleChecked={toggleChecked}
            progressValue={progressValue}
            onCheckedChange={setChecked}
            onRadioCheckedChange={setRadioChecked}
            onToggleCheckedChange={setToggleChecked}
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

          <div
            style={{
              display: 'grid',
              gap: spacing.scale['12'],
            }}
          >
            {DIRECTIONS.map((item) => (
              <div
                key={item}
                style={{
                  display: 'grid',
                  gap: spacing.scale['4'],
                }}
              >
                <span style={{ ...toTypography(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>
                  {toTitle(item)}
                </span>
                <TableCell
                  type={type}
                  size={size}
                  direction={item}
                  disabled={disabled}
                  showLeadIcon={showLeadIcon}
                  showAvatar={showAvatar}
                  showTailButton={showTailButton}
                  showCaption={showCaption}
                  checked={checked}
                  radioChecked={radioChecked}
                  toggleChecked={toggleChecked}
                  progressValue={progressValue}
                  onCheckedChange={setChecked}
                  onRadioCheckedChange={setRadioChecked}
                  onToggleCheckedChange={setToggleChecked}
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
