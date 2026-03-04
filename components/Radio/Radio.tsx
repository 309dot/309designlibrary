import React, { useState } from 'react';

import { border, colors, radius, shadows, spacing } from '../../style-tokens';

import type { RadioProps, RadioSize, RadioVisualState } from './Radio.types';

const palette = colors.primitive.palette;

type SizeConfig = {
  controlSize: number;
  dotSize: number;
};

const SIZE_CONFIG: Record<RadioSize, SizeConfig> = {
  sm: {
    controlSize: spacing.scale['16'],
    dotSize: spacing.scale['8'],
  },
  md: {
    controlSize: spacing.scale['20'],
    dotSize: spacing.scale['10'],
  },
};

function resolveVisualState(
  forcedState: RadioVisualState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
): RadioVisualState {
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

export function Radio({
  id,
  name,
  value,
  className,
  style,
  size = 'sm',
  checked = false,
  state,
  disabled = false,
  onCheckedChange,
  onClick,
  ariaLabel,
}: RadioProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const config = SIZE_CONFIG[size];
  const visualState = resolveVisualState(state, disabled, hovered, focused);
  const isDisabled = visualState === 'disabled';

  const backgroundColor = (() => {
    if (isDisabled && !checked) {
      return palette.gray['3'];
    }

    return palette.base.white;
  })();

  const borderWidth = (() => {
    if (isDisabled && !checked) {
      return border.width['0'];
    }

    if (checked) {
      return border.width['2'];
    }

    return border.width['1'];
  })();

  const borderColor = (() => {
    if (isDisabled && checked) {
      return palette.gray['2'];
    }

    if (checked) {
      return palette.purple['8'];
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

  const handleSelect = () => {
    if (isDisabled) {
      return;
    }

    if (!checked) {
      onCheckedChange?.(true);
    }

    onClick?.();
  };

  return (
    <button
      id={id}
      name={name}
      value={value}
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={handleSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={className}
      style={{
        width: config.controlSize,
        height: config.controlSize,
        display: 'grid',
        placeItems: 'center',
        padding: spacing.scale['0'],
        margin: spacing.scale['0'],
        borderStyle: 'solid',
        borderWidth,
        borderColor,
        borderRadius: radius.scale.full,
        backgroundColor,
        boxShadow,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {checked ? (
        <span
          aria-hidden="true"
          style={{
            width: config.dotSize,
            height: config.dotSize,
            borderRadius: radius.scale.full,
            backgroundColor: isDisabled ? palette.gray['3'] : palette.purple['8'],
            display: 'block',
          }}
        />
      ) : null}
    </button>
  );
}
