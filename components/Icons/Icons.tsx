import React, { useEffect, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing } from '../../style-tokens';

import type { IconSizeToken, IconTone, IconType, IconVisualState, IconsProps } from './Icons.types';

const REMIX_ICON_STYLESHEET_ID = '309-remixicon-stylesheet';
const REMIX_ICON_STYLESHEET_URL = 'https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css';

const SIZE_MAP: Record<IconSizeToken, number> = {
  '14': spacing.scale['14'],
  '16': spacing.scale['16'],
  '20': spacing.scale['20'],
  '24': spacing.scale['24'],
};

const iconBase = colors.semantic.theme.icon.base;
const iconStatus = colors.semantic.theme.icon.status;
const transparent = colors.primitive.palette.base.transparent;

const TONE_MAP: Record<IconTone, string> = {
  primary: iconBase.staticDark,
  secondary: iconBase.staticDarkSecondary,
  tertiary: iconBase.staticDarkTertiary,
  quaternary: iconBase.staticDarkQuaternary,
  inverted: iconBase.staticWhite,
  invertedSecondary: iconBase.staticWhiteSecondary,
  invertedTertiary: iconBase.staticWhiteTertiary,
  invertedQuaternary: iconBase.staticWhiteQuaternary,
  success: iconStatus.success,
  warning: iconStatus.warning,
  destructive: iconStatus.destructive,
  info: iconStatus.info,
};

function ensureRemixIconStylesheet() {
  if (typeof document === 'undefined') {
    return;
  }

  const exists = document.getElementById(REMIX_ICON_STYLESHEET_ID);

  if (exists) {
    return;
  }

  const link = document.createElement('link');
  link.id = REMIX_ICON_STYLESHEET_ID;
  link.rel = 'stylesheet';
  link.href = REMIX_ICON_STYLESHEET_URL;
  document.head.appendChild(link);
}

function normalizeIconName(name: string, type: IconType): string {
  const withoutPrefix = name.trim().replace(/^ri-/, '');

  if (!withoutPrefix) {
    return `question-${type}`;
  }

  const alreadyTyped = withoutPrefix.endsWith('-line') || withoutPrefix.endsWith('-fill');

  if (alreadyTyped) {
    return withoutPrefix;
  }

  return `${withoutPrefix}-${type}`;
}

function resolveState(forced: IconVisualState | undefined, disabled: boolean, hovered: boolean, focused: boolean): IconVisualState {
  if (disabled || forced === 'disabled') {
    return 'disabled';
  }

  if (forced) {
    return forced;
  }

  if (focused) {
    return 'focus';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function resolveColor(tone: IconTone, state: IconVisualState): string {
  if (state === 'disabled') {
    return iconBase.staticDarkQuaternary;
  }

  if (state === 'hover' || state === 'focus') {
    if (tone === 'secondary') {
      return iconBase.staticDark;
    }

    if (tone === 'tertiary') {
      return iconBase.staticDarkSecondary;
    }

    if (tone === 'quaternary') {
      return iconBase.staticDarkTertiary;
    }
  }

  return TONE_MAP[tone];
}

function resolveAriaLabel(name: string, ariaLabel: string | undefined): string {
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel;
  }

  return name.trim() || 'icon';
}

export function Icons({
  name,
  type = 'line',
  size = '24',
  tone = 'primary',
  state,
  decorative = true,
  ariaLabel,
  disabled = false,
  interactive = false,
  className,
  style,
  iconStyle,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: IconsProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    ensureRemixIconStylesheet();
  }, []);

  const resolvedState = resolveState(state, disabled, hovered, focused);
  const resolvedColor = resolveColor(tone, resolvedState);
  const iconClass = useMemo(() => `ri-${normalizeIconName(name, type)}`, [name, type]);
  const iconSize = SIZE_MAP[size];
  const interactiveMode = interactive || Boolean(onClick);

  const glyph = (
    <i
      className={iconClass}
      aria-hidden={decorative ? 'true' : undefined}
      style={{
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        fontSize: iconSize,
        lineHeight: `${iconSize}px`,
        color: resolvedColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...iconStyle,
      }}
    />
  );

  if (interactiveMode) {
    return (
      <button
        type="button"
        className={className}
        onClick={(event) => {
          if (resolvedState === 'disabled') {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        aria-label={decorative ? undefined : resolveAriaLabel(name, ariaLabel)}
        aria-hidden={decorative ? 'true' : undefined}
        aria-disabled={resolvedState === 'disabled' || undefined}
        disabled={resolvedState === 'disabled'}
        style={{
          margin: spacing.scale['0'],
          padding: spacing.scale['4'],
          borderStyle: 'solid',
          borderWidth: border.width['0'],
          borderRadius: radius.scale.md,
          backgroundColor: transparent,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: resolvedState === 'disabled' ? 'not-allowed' : 'pointer',
          boxShadow: resolvedState === 'focus' ? shadows.focusRing.light.css : 'none',
          color: resolvedColor,
          ...style,
        }}
      >
        {glyph}
      </button>
    );
  }

  return (
    <span
      className={className}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : resolveAriaLabel(name, ariaLabel)}
      aria-hidden={decorative ? 'true' : undefined}
      style={{
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: resolvedColor,
        ...style,
      }}
    >
      {glyph}
    </span>
  );
}

export default Icons;
