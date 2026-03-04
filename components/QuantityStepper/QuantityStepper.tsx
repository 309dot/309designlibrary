import React, { useMemo, useRef, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { QuantityStepperProps, QuantityStepperShape, QuantityStepperSize, QuantityStepperState } from './QuantityStepper.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeConfig = {
  actionSize: number;
  actionRadius: number;
  containerRoundedRadius: number;
  iconSize: number;
  textWidth: number;
  textTypography: TypographyToken;
};

const SIZE_CONFIG: Record<QuantityStepperSize, SizeConfig> = {
  lg: {
    actionSize: spacing.scale['40'],
    actionRadius: radius.scale.xl,
    containerRoundedRadius: radius.scale.xl,
    iconSize: spacing.scale['20'],
    textWidth: spacing.scale['28'],
    textTypography: typography.scale.captionL.medium,
  },
  md: {
    actionSize: spacing.scale['32'],
    actionRadius: radius.scale.lg,
    containerRoundedRadius: radius.scale.lg,
    iconSize: spacing.scale['16'],
    textWidth: spacing.scale['28'],
    textTypography: typography.scale.captionL.medium,
  },
};

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getResolvedState(
  forcedState: QuantityStepperState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
): QuantityStepperState {
  if (disabled || forcedState === 'disabled') {
    return 'disabled';
  }

  if (forcedState && forcedState !== 'default') {
    return forcedState;
  }

  if (focused) {
    return 'focused';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function resolveContainerBackground(state: QuantityStepperState): string {
  if (state === 'hover') {
    return palette.gray['2a'];
  }

  if (state === 'disabled') {
    return palette.gray['1'];
  }

  return palette.gray['1a'];
}

function resolveContainerBorderColor(state: QuantityStepperState): string {
  if (state === 'focused') {
    return border.color.theme.action.focusLight;
  }

  return palette.base.transparent;
}

function resolveContainerShadow(state: QuantityStepperState): string {
  if (state === 'focused') {
    return shadows.focusRing.light.css;
  }

  return 'none';
}

function StepperIcon({ type, size, color }: { type: 'add' | 'subtract'; size: number; color: string }) {
  const addPath = 'M9.16667 4.16667H10.8333V9.16667H15.8333V10.8333H10.8333V15.8333H9.16667V10.8333H4.16667V9.16667H9.16667V4.16667Z';
  const subtractPath = 'M4.16667 9.16667H15.8333V10.8333H4.16667V9.16667Z';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      style={{
        width: size,
        height: size,
        display: 'block',
        flexShrink: 0,
        color,
      }}
    >
      <path d={type === 'add' ? addPath : subtractPath} fill="currentColor" />
    </svg>
  );
}

function StepActionButton({
  type,
  disabled,
  iconColor,
  sizeConfig,
  onClick,
  ariaLabel,
}: {
  type: 'add' | 'subtract';
  disabled: boolean;
  iconColor: string;
  sizeConfig: SizeConfig;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      style={{
        width: sizeConfig.actionSize,
        height: sizeConfig.actionSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: sizeConfig.actionRadius,
        backgroundColor: palette.base.transparent,
        padding: spacing.scale['0'],
        margin: spacing.scale['0'],
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <StepperIcon type={type} size={sizeConfig.iconSize} color={iconColor} />
    </button>
  );
}

export function QuantityStepper({
  size = 'lg',
  shape = 'rounded',
  state,
  value,
  defaultValue = spacing.scale['2'],
  min = spacing.scale['0'],
  max = spacing.primitive['999'],
  step = spacing.scale['1'],
  disabled = false,
  decreaseAriaLabel = 'Decrease quantity',
  increaseAriaLabel = 'Increase quantity',
  onValueChange,
  onDecrease,
  onIncrease,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: QuantityStepperProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sizeConfig = SIZE_CONFIG[size];
  const isControlled = typeof value === 'number';
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const currentValue = useMemo(
    () => clampValue(isControlled ? (value as number) : internalValue, min, max),
    [internalValue, isControlled, max, min, value],
  );

  const resolvedState = getResolvedState(state, disabled, hovered, focused);
  const containerRadius = shape === 'pill' ? radius.scale.full : sizeConfig.containerRoundedRadius;
  const atMin = currentValue <= min;
  const atMax = currentValue >= max;
  const textColor = resolvedState === 'disabled' ? textBase.staticDarkQuaternary : textBase.staticDark;
  const enabledIconColor = textBase.staticDark;
  const disabledIconColor = textBase.staticDarkQuaternary;

  function applyValue(next: number, changeType: 'decrease' | 'increase') {
    const clamped = clampValue(next, min, max);

    if (!isControlled) {
      setInternalValue(clamped);
    }

    onValueChange?.(clamped);

    if (changeType === 'decrease') {
      onDecrease?.(clamped);
    } else {
      onIncrease?.(clamped);
    }
  }

  function handleDecrease() {
    if (resolvedState === 'disabled' || atMin) {
      return;
    }

    applyValue(currentValue - step, 'decrease');
  }

  function handleIncrease() {
    if (resolvedState === 'disabled' || atMax) {
      return;
    }

    applyValue(currentValue + step, 'increase');
  }

  return (
    <div
      ref={rootRef}
      className={className}
      role="spinbutton"
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={resolvedState === 'disabled' || undefined}
      tabIndex={resolvedState === 'disabled' ? -1 : 0}
      onMouseEnter={(event) => {
        if (!state && !disabled) {
          setHovered(true);
        }
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!state && !disabled) {
          setHovered(false);
        }
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        if (!state && !disabled) {
          setFocused(true);
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget as Node | null;
        const stillInside = Boolean(nextTarget && rootRef.current?.contains(nextTarget));
        if (!state && !disabled && !stillInside) {
          setFocused(false);
        }
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (resolvedState !== 'disabled') {
          if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            event.preventDefault();
            handleIncrease();
          }

          if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            event.preventDefault();
            handleDecrease();
          }
        }

        onKeyDown?.(event);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.scale['0'],
        borderStyle: 'solid',
        borderWidth: resolvedState === 'focused' ? border.width['1'] : border.width['0'],
        borderColor: resolveContainerBorderColor(resolvedState),
        borderRadius: containerRadius,
        backgroundColor: resolveContainerBackground(resolvedState),
        boxShadow: resolveContainerShadow(resolvedState),
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <StepActionButton
        type="subtract"
        disabled={resolvedState === 'disabled' || atMin}
        iconColor={resolvedState === 'disabled' || atMin ? disabledIconColor : enabledIconColor}
        sizeConfig={sizeConfig}
        onClick={handleDecrease}
        ariaLabel={decreaseAriaLabel}
      />

      <span
        style={{
          width: sizeConfig.textWidth,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          textAlign: 'center',
          ...toTypographyStyle(sizeConfig.textTypography),
        }}
      >
        {currentValue}
      </span>

      <StepActionButton
        type="add"
        disabled={resolvedState === 'disabled' || atMax}
        iconColor={resolvedState === 'disabled' || atMax ? disabledIconColor : enabledIconColor}
        sizeConfig={sizeConfig}
        onClick={handleIncrease}
        ariaLabel={increaseAriaLabel}
      />
    </div>
  );
}

