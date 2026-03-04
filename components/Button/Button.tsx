import React, { useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { ButtonProps, ButtonShape, ButtonSize, ButtonVariant } from './Button.types';

type InteractionState = 'default' | 'hover' | 'focus' | 'disabled';

type StyleState = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  boxShadow: string;
};

const buttonBackgroundTokens = colors.semantic.theme.background.button;
const buttonBorderTokens = border.color.theme.action;
const textBaseTokens = colors.semantic.theme.text.base;
const textStatusTokens = colors.semantic.theme.text.status;

const SIZE_CONFIG: Record<
  ButtonSize,
  {
    minHeight: number;
    defaultPaddingX: number;
    defaultPaddingY: number;
    defaultGap: number;
    iconOnlyPadding: number;
    iconOnlyGap: number;
    iconSize: number;
    roundedRadius: number;
    typographyStyle: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: number;
    };
  }
> = {
  xs: {
    minHeight: spacing.scale['24'],
    defaultPaddingX: spacing.scale['8'],
    defaultPaddingY: spacing.scale['4'],
    defaultGap: spacing.scale['4'],
    iconOnlyPadding: spacing.scale['5'],
    iconOnlyGap: spacing.scale['0'],
    iconSize: spacing.scale['24'],
    roundedRadius: radius.scale.md,
    typographyStyle: typography.scale.captionM.medium,
  },
  sm: {
    minHeight: spacing.scale['32'],
    defaultPaddingX: spacing.scale['10'],
    defaultPaddingY: spacing.scale['6'],
    defaultGap: spacing.scale['2'],
    iconOnlyPadding: spacing.scale['8'],
    iconOnlyGap: spacing.scale['2'],
    iconSize: spacing.scale['24'],
    roundedRadius: radius.scale.lg,
    typographyStyle: typography.scale.captionL.medium,
  },
  md: {
    minHeight: spacing.scale['40'],
    defaultPaddingX: spacing.scale['12'],
    defaultPaddingY: spacing.scale['10'],
    defaultGap: spacing.scale['4'],
    iconOnlyPadding: spacing.scale['10'],
    iconOnlyGap: spacing.scale['4'],
    iconSize: spacing.scale['24'],
    roundedRadius: radius.scale.xl,
    typographyStyle: typography.scale.captionL.medium,
  },
  lg: {
    minHeight: spacing.scale['48'],
    defaultPaddingX: spacing.scale['16'],
    defaultPaddingY: spacing.scale['12'],
    defaultGap: spacing.scale['4'],
    iconOnlyPadding: spacing.scale['14'],
    iconOnlyGap: spacing.scale['4'],
    iconSize: spacing.scale['24'],
    roundedRadius: radius.scale.xl,
    typographyStyle: typography.scale.bodyL.medium,
  },
};

const DESTRUCTIVE_VARIANTS: ReadonlySet<ButtonVariant> = new Set([
  'destructive',
  'destructiveSecondary',
  'destructiveTertiary',
  'destructiveGhost',
]);

const STATE_COLOR_MAP: Record<ButtonVariant, { default: string; hover: string; disabled: string }> = {
  primary: {
    default: buttonBackgroundTokens.primary,
    hover: buttonBackgroundTokens.primaryHover,
    disabled: buttonBackgroundTokens.primaryDisabled,
  },
  secondary: {
    default: buttonBackgroundTokens.secondary,
    hover: buttonBackgroundTokens.secondaryHover,
    disabled: buttonBackgroundTokens.secondaryDisabled,
  },
  tertiary: {
    default: buttonBackgroundTokens.tertiary,
    hover: buttonBackgroundTokens.tertiaryHover,
    disabled: buttonBackgroundTokens.tertiaryDisabled,
  },
  ghost: {
    default: buttonBackgroundTokens.ghost,
    hover: buttonBackgroundTokens.ghostHover,
    disabled: buttonBackgroundTokens.ghostDisabled,
  },
  destructive: {
    default: buttonBackgroundTokens.destructive,
    hover: buttonBackgroundTokens.destructiveHover,
    disabled: buttonBackgroundTokens.destructiveDisabled,
  },
  destructiveSecondary: {
    default: buttonBackgroundTokens.destructiveSecondary,
    hover: buttonBackgroundTokens.destructiveSecondaryHover,
    disabled: buttonBackgroundTokens.destructiveSecondaryDisabled,
  },
  destructiveTertiary: {
    default: buttonBackgroundTokens.destructiveTertiary,
    hover: buttonBackgroundTokens.destructiveTertiaryHover,
    disabled: buttonBackgroundTokens.destructiveTertiaryDisabled,
  },
  destructiveGhost: {
    default: buttonBackgroundTokens.destructiveGhost,
    hover: buttonBackgroundTokens.destructiveGhostHover,
    disabled: buttonBackgroundTokens.destructiveGhostDisabled,
  },
};

const STATE_TEXT_MAP: Record<ButtonVariant, { default: string; hover: string; disabled: string }> = {
  primary: {
    default: textBaseTokens.inverted,
    hover: textBaseTokens.inverted,
    disabled: textBaseTokens.invertedSecondary,
  },
  secondary: {
    default: textBaseTokens.primary,
    hover: textBaseTokens.primary,
    disabled: textBaseTokens.secondary,
  },
  tertiary: {
    default: textBaseTokens.primary,
    hover: textBaseTokens.primary,
    disabled: textBaseTokens.secondary,
  },
  ghost: {
    default: textBaseTokens.primary,
    hover: textBaseTokens.primary,
    disabled: textBaseTokens.secondary,
  },
  destructive: {
    default: textBaseTokens.staticWhite,
    hover: textBaseTokens.staticWhite,
    disabled: textBaseTokens.staticWhiteSecondary,
  },
  destructiveSecondary: {
    default: textStatusTokens.destructive,
    hover: textStatusTokens.destructive,
    disabled: textStatusTokens.destructiveSecondary,
  },
  destructiveTertiary: {
    default: textStatusTokens.destructive,
    hover: textStatusTokens.destructive,
    disabled: textStatusTokens.destructiveSecondary,
  },
  destructiveGhost: {
    default: textStatusTokens.destructive,
    hover: textStatusTokens.destructive,
    disabled: textStatusTokens.destructiveSecondary,
  },
};

function getBorderColor(variant: ButtonVariant, interactionState: InteractionState): string {
  const destructive = DESTRUCTIVE_VARIANTS.has(variant);

  if (interactionState === 'focus') {
    return destructive ? buttonBorderTokens.focusDestructive : buttonBorderTokens.focus;
  }

  if (interactionState === 'hover') {
    return destructive ? buttonBorderTokens.destructiveHover : buttonBorderTokens.hover;
  }

  if (interactionState === 'disabled') {
    return destructive ? buttonBorderTokens.destructiveDisabled : buttonBorderTokens.disabled;
  }

  return destructive ? buttonBorderTokens.destructive : buttonBorderTokens.normal;
}

function getFocusRing(variant: ButtonVariant, interactionState: InteractionState): string {
  if (interactionState !== 'focus') {
    return 'none';
  }

  return DESTRUCTIVE_VARIANTS.has(variant) ? shadows.focusRing.lightDestructive.css : shadows.focusRing.light.css;
}

function getResolvedInteractionState(
  disabled: boolean,
  forceState: ButtonProps['forceState'] | undefined,
  hovered: boolean,
  focused: boolean,
): InteractionState {
  if (disabled) {
    return 'disabled';
  }

  if (forceState === 'focus') {
    return 'focus';
  }

  if (forceState === 'hover') {
    return 'hover';
  }

  if (focused) {
    return 'focus';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function getVisualState(variant: ButtonVariant, interactionState: InteractionState): StyleState {
  const background = STATE_COLOR_MAP[variant];
  const text = STATE_TEXT_MAP[variant];

  if (interactionState === 'disabled') {
    return {
      backgroundColor: background.disabled,
      borderColor: getBorderColor(variant, interactionState),
      textColor: text.disabled,
      boxShadow: getFocusRing(variant, interactionState),
    };
  }

  if (interactionState === 'hover') {
    return {
      backgroundColor: background.hover,
      borderColor: getBorderColor(variant, interactionState),
      textColor: text.hover,
      boxShadow: getFocusRing(variant, interactionState),
    };
  }

  if (interactionState === 'focus') {
    return {
      backgroundColor: background.default,
      borderColor: getBorderColor(variant, interactionState),
      textColor: text.default,
      boxShadow: getFocusRing(variant, interactionState),
    };
  }

  return {
    backgroundColor: background.default,
    borderColor: getBorderColor(variant, interactionState),
    textColor: text.default,
    boxShadow: getFocusRing(variant, interactionState),
  };
}

function getBorderRadius(shape: ButtonShape, roundedRadius: number): number {
  if (shape === 'pill') {
    return radius.scale.full;
  }

  return roundedRadius;
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'default',
  shape = 'rounded',
  htmlType = 'button',
  forceState,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const sizeConfig = SIZE_CONFIG[size];
  const iconOnly = type === 'iconOnly';
  const lead = leftIcon ?? rightIcon;
  const gap = iconOnly ? sizeConfig.iconOnlyGap : sizeConfig.defaultGap;
  const paddingInline = iconOnly ? sizeConfig.iconOnlyPadding : sizeConfig.defaultPaddingX;
  const paddingBlock = iconOnly ? sizeConfig.iconOnlyPadding : sizeConfig.defaultPaddingY;
  const borderRadius = getBorderRadius(shape, sizeConfig.roundedRadius);

  const interactionState = getResolvedInteractionState(disabled, forceState, hovered, focused);
  const visualState = useMemo(() => getVisualState(variant, interactionState), [variant, interactionState]);

  return (
    <button
      type={htmlType}
      disabled={disabled}
      onMouseEnter={(event) => {
        if (!disabled) {
          setHovered(true);
        }
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!disabled) {
          setHovered(false);
        }
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        if (!disabled) {
          setFocused(true);
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!disabled) {
          setFocused(false);
        }
        onBlur?.(event);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        minHeight: sizeConfig.minHeight,
        width: fullWidth ? '100%' : 'fit-content',
        paddingInline,
        paddingBlock,
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderRadius,
        backgroundColor: visualState.backgroundColor,
        borderColor: visualState.borderColor,
        color: visualState.textColor,
        boxShadow: visualState.boxShadow,
        fontFamily: sizeConfig.typographyStyle.fontFamily,
        fontWeight: sizeConfig.typographyStyle.fontWeight,
        fontSize: sizeConfig.typographyStyle.fontSize,
        lineHeight: `${sizeConfig.typographyStyle.lineHeight}px`,
        letterSpacing: `${sizeConfig.typographyStyle.letterSpacing}px`,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        outline: 'none',
        appearance: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...props}
    >
      {!iconOnly && leftIcon ? (
        <span
          aria-hidden="true"
          style={{
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {leftIcon}
        </span>
      ) : null}

      {!iconOnly ? <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{children}</span> : null}

      {!iconOnly && rightIcon ? (
        <span
          aria-hidden="true"
          style={{
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {rightIcon}
        </span>
      ) : null}

      {iconOnly && lead ? (
        <span
          aria-hidden="true"
          style={{
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {lead}
        </span>
      ) : null}
    </button>
  );
}

export default Button;
