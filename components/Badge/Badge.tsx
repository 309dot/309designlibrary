import React from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import type { BadgeColor, BadgeProps, BadgeShape, BadgeSize, BadgeVisualState } from './Badge.types';

type InteractionState = BadgeVisualState;

type BadgeStyleState = {
  backgroundColor: string;
  textColor: string;
};

const primitiveColors = colors.primitive.palette;

const SIZE_CONFIG: Record<
  BadgeSize,
  {
    height: number;
    paddingX: number;
    paddingY: number;
    labelPaddingX: number;
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
    height: spacing.scale['16'],
    paddingX: spacing.scale['2'],
    paddingY: spacing.scale['0'],
    labelPaddingX: spacing.scale['2'],
    iconSize: spacing.scale['12'],
    roundedRadius: radius.scale.xs,
    typographyStyle: typography.scale.captionM.medium,
  },
  sm: {
    height: spacing.scale['20'],
    paddingX: spacing.primitive['3'],
    paddingY: spacing.scale['2'],
    labelPaddingX: spacing.primitive['3'],
    iconSize: spacing.scale['14'],
    roundedRadius: radius.scale.sm,
    typographyStyle: typography.scale.captionM.medium,
  },
  md: {
    height: spacing.scale['24'],
    paddingX: spacing.scale['4'],
    paddingY: spacing.scale['2'],
    labelPaddingX: spacing.scale['4'],
    iconSize: spacing.scale['16'],
    roundedRadius: radius.scale.md,
    typographyStyle: typography.scale.captionL.medium,
  },
  lg: {
    height: spacing.scale['28'],
    paddingX: spacing.scale['6'],
    paddingY: spacing.scale['4'],
    labelPaddingX: spacing.scale['4'],
    iconSize: spacing.scale['16'],
    roundedRadius: radius.scale.md,
    typographyStyle: typography.scale.captionL.medium,
  },
};

const COLOR_CONFIG: Record<
  BadgeColor,
  {
    background: {
      default: string;
      disabled: string;
    };
    text: {
      default: string;
      disabled: string;
    };
  }
> = {
  gray: {
    background: {
      default: primitiveColors.gray['2'],
      disabled: primitiveColors.gray['2'],
    },
    text: {
      default: primitiveColors.gray['9a'],
      disabled: primitiveColors.gray['5a'],
    },
  },
  blue: {
    background: {
      default: primitiveColors.blue['2'],
      disabled: primitiveColors.blue['1'],
    },
    text: {
      default: primitiveColors.blue['11'],
      disabled: primitiveColors.blue['7a'],
    },
  },
  green: {
    background: {
      default: primitiveColors.green['2'],
      disabled: primitiveColors.green['1'],
    },
    text: {
      default: primitiveColors.green['11'],
      disabled: primitiveColors.green['7a'],
    },
  },
  orange: {
    background: {
      default: primitiveColors.orange['2'],
      disabled: primitiveColors.orange['1'],
    },
    text: {
      default: primitiveColors.orange['11'],
      disabled: primitiveColors.orange['7a'],
    },
  },
  red: {
    background: {
      default: primitiveColors.red['2'],
      disabled: primitiveColors.red['1'],
    },
    text: {
      default: primitiveColors.red['11'],
      disabled: primitiveColors.red['7a'],
    },
  },
  purple: {
    background: {
      default: primitiveColors.purple['2'],
      disabled: primitiveColors.purple['2'],
    },
    text: {
      default: primitiveColors.purple['11'],
      disabled: primitiveColors.purple['7a'],
    },
  },
  white: {
    background: {
      default: primitiveColors.base.white,
      disabled: primitiveColors.base.white,
    },
    text: {
      default: primitiveColors.gray['9a'],
      disabled: primitiveColors.gray['5a'],
    },
  },
  whiteDestructive: {
    background: {
      default: primitiveColors.base.white,
      disabled: primitiveColors.base.white,
    },
    text: {
      default: primitiveColors.red['8'],
      disabled: primitiveColors.red['5a'],
    },
  },
  surface: {
    background: {
      default: primitiveColors.base.white,
      disabled: primitiveColors.base.white,
    },
    text: {
      default: primitiveColors.gray['9a'],
      disabled: primitiveColors.gray['5a'],
    },
  },
  surfaceDestructive: {
    background: {
      default: primitiveColors.base.white,
      disabled: primitiveColors.base.white,
    },
    text: {
      default: primitiveColors.red['8'],
      disabled: primitiveColors.red['5a'],
    },
  },
};

function resolveInteractionState(disabled: boolean, forceState: BadgeProps['forceState'] | undefined): InteractionState {
  if (disabled || forceState === 'disabled') {
    return 'disabled';
  }

  return forceState ?? 'default';
}

function resolveVisualState(color: BadgeColor, interactionState: InteractionState): BadgeStyleState {
  const config = COLOR_CONFIG[color];

  if (interactionState === 'disabled') {
    return {
      backgroundColor: config.background.disabled,
      textColor: config.text.disabled,
    };
  }

  // Figma Badge variant set does not define hover/focus visuals.
  return {
    backgroundColor: config.background.default,
    textColor: config.text.default,
  };
}

function resolveBorderColor(stroke: boolean): string {
  return stroke ? primitiveColors.gray['2a'] : primitiveColors.base.transparent;
}

function resolveBorderRadius(shape: BadgeShape, roundedRadius: number): number {
  if (shape === 'pill') {
    return radius.scale.full;
  }

  return roundedRadius;
}

export function Badge({
  color = 'gray',
  size = 'md',
  shape = 'rounded',
  stroke = false,
  disabled = false,
  forceState,
  leadingIcon,
  trailingIcon,
  style,
  children = 'Badge',
  ...props
}: BadgeProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const interactionState = resolveInteractionState(disabled, forceState);
  const visualState = resolveVisualState(color, interactionState);

  return (
    <div
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.scale['0'],
        minHeight: sizeConfig.height,
        width: 'fit-content',
        paddingInline: sizeConfig.paddingX,
        paddingBlock: sizeConfig.paddingY,
        borderStyle: 'solid',
        borderWidth: stroke ? border.width['1'] : border.width['0'],
        borderColor: resolveBorderColor(stroke),
        borderRadius: resolveBorderRadius(shape, sizeConfig.roundedRadius),
        backgroundColor: visualState.backgroundColor,
        color: visualState.textColor,
        fontFamily: sizeConfig.typographyStyle.fontFamily,
        fontWeight: sizeConfig.typographyStyle.fontWeight,
        fontSize: sizeConfig.typographyStyle.fontSize,
        lineHeight: `${sizeConfig.typographyStyle.lineHeight}px`,
        letterSpacing: `${sizeConfig.typographyStyle.letterSpacing}px`,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        cursor: disabled ? 'not-allowed' : 'default',
        ...style,
      }}
      {...props}
    >
      {leadingIcon ? (
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
          {leadingIcon}
        </span>
      ) : null}

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: sizeConfig.labelPaddingX,
          paddingBlock: spacing.scale['0'],
        }}
      >
        {children}
      </span>

      {trailingIcon ? (
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
          {trailingIcon}
        </span>
      ) : null}
    </div>
  );
}

export default Badge;
