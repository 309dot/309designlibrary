import React, { useEffect, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing } from '../../style-tokens';

import type { ToggleProps, ToggleSize, ToggleVisualState } from './Toggle.types';

type SizeConfig = {
  trackWidth: number;
  trackHeight: number;
  knobSize: number;
  insetPadding: number;
  activeInset: number;
};

const SIZE_CONFIG: Record<ToggleSize, SizeConfig> = {
  sm: {
    trackWidth: spacing.scale['28'],
    trackHeight: spacing.scale['16'],
    knobSize: spacing.scale['12'],
    insetPadding: spacing.scale['2'],
    activeInset: spacing.scale['14'],
  },
  md: {
    trackWidth: spacing.scale['20'] + spacing.scale['14'],
    trackHeight: spacing.scale['20'],
    knobSize: spacing.scale['16'],
    insetPadding: spacing.scale['2'],
    activeInset: spacing.scale['16'],
  },
};

const toggleBackground = colors.semantic.theme.background.toggle;

function resolveVisualState(
  forcedState: ToggleVisualState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
): ToggleVisualState {
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

function resolveTrackColor(checked: boolean, visualState: ToggleVisualState): string {
  if (visualState === 'disabled') {
    return checked ? toggleBackground.activeDisabled : toggleBackground.disabled;
  }

  if (visualState === 'hover') {
    return checked ? toggleBackground.activeHover : toggleBackground.hover;
  }

  return checked ? toggleBackground.active : toggleBackground.default;
}

function resolveKnobColor(checked: boolean, visualState: ToggleVisualState): string {
  if (visualState === 'disabled' && !checked) {
    return toggleBackground.handleDisabled;
  }

  return toggleBackground.handle;
}

function resolveTrackShadow(visualState: ToggleVisualState): string {
  if (visualState !== 'focus') {
    return 'none';
  }

  return shadows.focusRing.light.css;
}

function resolveKnobShadow(visualState: ToggleVisualState): string {
  if (visualState === 'disabled') {
    return 'none';
  }

  return shadows.elevation.xs.css;
}

export function Toggle({
  size = 'md',
  checked,
  defaultChecked = false,
  disabled = false,
  state,
  onCheckedChange,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  style,
  ...rest
}: ToggleProps) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setInternalChecked(defaultChecked);
  }, [defaultChecked, isControlled]);

  const resolvedChecked = isControlled ? Boolean(checked) : internalChecked;
  const visualState = resolveVisualState(state, disabled, hovered, focused);
  const isDisabled = visualState === 'disabled';

  const config = SIZE_CONFIG[size];

  const knobPadding = useMemo(() => {
    return resolvedChecked
      ? {
          paddingLeft: config.activeInset,
          paddingRight: config.insetPadding,
        }
      : {
          paddingLeft: config.insetPadding,
          paddingRight: config.activeInset,
        };
  }, [config.activeInset, config.insetPadding, resolvedChecked]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={resolvedChecked}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      onClick={handleToggle}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
      style={{
        width: config.trackWidth,
        height: config.trackHeight,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: resolvedChecked ? 'flex-end' : 'flex-start',
        gap: spacing.scale['0'],
        paddingTop: config.insetPadding,
        paddingBottom: config.insetPadding,
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: radius.scale.full,
        backgroundColor: resolveTrackColor(resolvedChecked, visualState),
        boxShadow: resolveTrackShadow(visualState),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...knobPadding,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: config.knobSize,
          height: config.knobSize,
          borderRadius: radius.scale.full,
          backgroundColor: resolveKnobColor(resolvedChecked, visualState),
          boxShadow: resolveKnobShadow(visualState),
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
    </button>
  );
}

export default Toggle;
