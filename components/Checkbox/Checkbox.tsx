import React, { useState } from 'react';

import { border, colors, radius, shadows, spacing } from '../../style-tokens';

import type { CheckboxProps, CheckboxSize, CheckboxType, CheckboxVisualState } from './Checkbox.types';

const CHECK_ICON_SRC = '/components/Checkbox/assets/check.svg';
const MINUS_ICON_SRC = '/components/Checkbox/assets/minus.svg';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

type SizeConfig = {
  boxSize: number;
  iconCheckHeight: number;
  iconMinusHeight: number;
};

const SIZE_CONFIG: Record<CheckboxSize, SizeConfig> = {
  sm: {
    boxSize: spacing.scale['16'],
    iconCheckHeight: spacing.scale['6'],
    iconMinusHeight: spacing.scale['2'],
  },
  md: {
    boxSize: spacing.scale['20'],
    iconCheckHeight: spacing.scale['6'],
    iconMinusHeight: spacing.scale['2'],
  },
};

function resolveVisualState(
  forcedState: CheckboxVisualState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
): CheckboxVisualState {
  if (disabled || forcedState === 'disabled') {
    return 'disabled';
  }

  if (forcedState && forcedState !== 'default') {
    return forcedState;
  }

  if (focused) {
    return 'focus';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function resolveChecked(type: CheckboxType, checked: boolean): boolean {
  if (type === 'indeterminate') {
    return false;
  }

  return checked;
}

function resolveIcon(type: CheckboxType, checked: boolean): 'check' | 'minus' | null {
  if (type === 'indeterminate') {
    return 'minus';
  }

  return checked ? 'check' : null;
}

export function Checkbox({
  id,
  name,
  value,
  className,
  style,
  size = 'sm',
  type = 'default',
  checked = false,
  state,
  disabled = false,
  onCheckedChange,
  onClick,
  ariaLabel,
}: CheckboxProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const controlledChecked = resolveChecked(type, checked);
  const visualState = resolveVisualState(state, disabled, hovered, focused);
  const isDisabled = visualState === 'disabled';
  const icon = resolveIcon(type, controlledChecked);

  const config = SIZE_CONFIG[size];

  const backgroundColor = (() => {
    if (isDisabled) {
      return palette.gray['3'];
    }

    if (icon) {
      return palette.purple['8'];
    }

    return palette.base.white;
  })();

  const borderColor = (() => {
    if (isDisabled) {
      return palette.base.transparent;
    }

    if (icon) {
      return palette.base.transparent;
    }

    if (visualState === 'hover') {
      return palette.gray['4'];
    }

    return palette.gray['3'];
  })();

  const boxShadow = (() => {
    if (isDisabled) {
      return 'none';
    }

    if (visualState === 'focus') {
      return shadows.focusRing.light.css;
    }

    return shadows.elevation.xs.css;
  })();

  const handleToggle = () => {
    if (isDisabled) {
      return;
    }

    if (type === 'indeterminate') {
      onCheckedChange?.(false);
      onClick?.();
      return;
    }

    onCheckedChange?.(!controlledChecked);
    onClick?.();
  };

  return (
    <button
      id={id}
      name={name}
      value={value}
      type="button"
      role="checkbox"
      aria-checked={type === 'indeterminate' ? 'mixed' : controlledChecked}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={handleToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={className}
      style={{
        width: config.boxSize,
        height: config.boxSize,
        display: 'grid',
        placeItems: 'center',
        padding: spacing.scale['0'],
        margin: spacing.scale['0'],
        borderStyle: 'solid',
        borderWidth: icon || isDisabled ? border.width['0'] : border.width['1'],
        borderColor,
        borderRadius: radius.scale.xs,
        backgroundColor,
        boxShadow,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: spacing.scale['8'],
            height: icon === 'check' ? config.iconCheckHeight : config.iconMinusHeight,
            color: textBase.staticWhite,
            overflow: 'visible',
          }}
        >
          <img
            src={icon === 'check' ? CHECK_ICON_SRC : MINUS_ICON_SRC}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </span>
      ) : null}

    </button>
  );
}
