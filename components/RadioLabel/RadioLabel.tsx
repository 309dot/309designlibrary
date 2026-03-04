import React, { useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { Radio } from '../Radio/Radio';
import type { RadioVisualState } from '../Radio/Radio.types';

import type { RadioLabelProps, RadioLabelSize } from './RadioLabel.types';

const textBase = colors.semantic.theme.text.base;

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type LabelSizeConfig = {
  gap: number;
  labelTypography: TypographyToken;
  captionTypography: TypographyToken;
};

const SIZE_CONFIG: Record<RadioLabelSize, LabelSizeConfig> = {
  sm: {
    gap: spacing.scale['8'],
    labelTypography: typography.scale.captionL.medium,
    captionTypography: typography.scale.captionL.regular,
  },
  md: {
    gap: spacing.scale['12'],
    labelTypography: typography.scale.bodyS.medium,
    captionTypography: typography.scale.bodyS.regular,
  },
};

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

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

export function RadioLabel({
  id,
  className,
  style,
  size = 'sm',
  checked = false,
  state,
  label = 'Radio label',
  caption = 'Caption',
  showCaption = true,
  disabled = false,
  onCheckedChange,
}: RadioLabelProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const config = SIZE_CONFIG[size];
  const visualState = resolveVisualState(state, disabled, hovered, focused);
  const isDisabled = visualState === 'disabled';

  const handleSelect = () => {
    if (isDisabled) {
      return;
    }

    if (!checked) {
      onCheckedChange?.(true);
    }
  };

  return (
    <div
      id={id}
      role="radio"
      aria-checked={checked}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (isDisabled) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: config.gap,
        padding: spacing.scale['0'],
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: spacing.scale['0'],
          paddingInline: spacing.scale['0'],
          paddingTop: spacing.scale['2'],
          paddingBottom: spacing.scale['0'],
        }}
      >
        <Radio
          size={size}
          checked={checked}
          state={visualState}
          disabled={isDisabled}
          onCheckedChange={() => {
            handleSelect();
          }}
          ariaLabel={label}
        />
      </span>

      <span
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['4'],
          padding: spacing.scale['0'],
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            color: textBase.staticDark,
            ...toTypographyStyle(config.labelTypography),
          }}
        >
          {label}
        </span>

        {showCaption ? (
          <span
            style={{
              color: textBase.staticDarkSecondary,
              ...toTypographyStyle(config.captionTypography),
            }}
          >
            {caption}
          </span>
        ) : null}
      </span>
    </div>
  );
}
