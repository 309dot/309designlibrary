import React from 'react';

import { border, colors, spacing, typography } from '../../style-tokens';

import { Checkbox } from '../Checkbox/Checkbox';

import type { TableHeaderDirection, TableHeaderProps } from './TableHeader.types';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const HEADER_WIDTH = spacing.scale['224'] + spacing.scale['56'];

function toTypographyStyle(token: {
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

function SortIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" style={{ width: size, height: size, display: 'block' }}>
      <path
        d="M6.5 8L10 4.5L13.5 8"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12L10 15.5L13.5 12"
        fill="none"
        stroke={color}
        strokeWidth={border.width['2']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getTextContainerStyle(direction: TableHeaderDirection): React.CSSProperties {
  if (direction === 'center') {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.scale['2'],
      flex: '1 0 0',
      minWidth: spacing.scale['0'],
      minHeight: spacing.scale['0'],
    };
  }

  if (direction === 'right') {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.scale['2'],
      flex: '1 0 0',
      minWidth: spacing.scale['0'],
      minHeight: spacing.scale['0'],
    };
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.scale['2'],
    flexShrink: spacing.scale['0'],
  };
}

export function TableHeader({
  id,
  className,
  style,
  direction = 'left',
  disabled = false,
  title = 'Header',
  showCheckbox = true,
  checkboxChecked = false,
  showSortIcon = false,
  onCheckboxCheckedChange,
  onSortClick,
}: TableHeaderProps) {
  return (
    <div
      id={id}
      className={className}
      style={{
        width: HEADER_WIDTH,
        height: spacing.scale['40'],
        display: 'flex',
        alignItems: 'center',
        gap: spacing.scale['12'],
        paddingInline: spacing.scale['12'],
        backgroundColor: palette.gray['1'],
        boxSizing: 'border-box',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      aria-disabled={disabled || undefined}
    >
      {showCheckbox ? (
        <span
          style={{
            width: spacing.scale['16'],
            height: spacing.scale['16'],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: spacing.scale['0'],
          }}
        >
          <Checkbox
            size="sm"
            checked={checkboxChecked}
            disabled={disabled}
            onCheckedChange={onCheckboxCheckedChange}
            ariaLabel="Table header checkbox"
          />
        </span>
      ) : null}

      <div style={getTextContainerStyle(direction)}>
        <span
          style={{
            ...toTypographyStyle(typography.scale.captionL.regular),
            color: textBase.staticDarkSecondary,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>

        {showSortIcon ? (
          <button
            type="button"
            disabled={disabled || !onSortClick}
            onClick={!disabled ? onSortClick : undefined}
            style={{
              width: spacing.scale['16'],
              height: spacing.scale['16'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: spacing.scale['0'],
              borderStyle: 'solid',
              borderWidth: border.width['0'],
              borderRadius: spacing.scale['0'],
              backgroundColor: palette.base.transparent,
              color: textBase.staticDarkSecondary,
              cursor: disabled || !onSortClick ? 'default' : 'pointer',
            }}
            aria-label="Sort column"
          >
            <SortIcon size={spacing.scale['16']} color={textBase.staticDarkSecondary} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
