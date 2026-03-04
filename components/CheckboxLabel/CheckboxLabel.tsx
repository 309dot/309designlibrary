import React, { useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { Checkbox } from '../Checkbox/Checkbox';
import type { CheckboxType, CheckboxVisualState } from '../Checkbox/Checkbox.types';

import type { CheckboxLabelProps, CheckboxLabelSize, CheckboxLabelType } from './CheckboxLabel.types';

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

const SIZE_CONFIG: Record<CheckboxLabelSize, LabelSizeConfig> = {
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

function toCheckboxType(type: CheckboxLabelType): CheckboxType {
  return type === 'indeterminate' ? 'indeterminate' : 'default';
}

function toCheckboxChecked(type: CheckboxLabelType): boolean {
  return type === 'checked';
}

function getNextType(type: CheckboxLabelType): CheckboxLabelType {
  if (type === 'default') {
    return 'checked';
  }

  if (type === 'checked') {
    return 'default';
  }

  return 'checked';
}

export function CheckboxLabel({
  id,
  className,
  style,
  size = 'sm',
  type = 'default',
  state,
  label = 'Checkbox label',
  caption = 'Caption',
  showCaption = true,
  disabled = false,
  onTypeChange,
}: CheckboxLabelProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const config = SIZE_CONFIG[size];
  const visualState = resolveVisualState(state, disabled, hovered, focused);
  const isDisabled = visualState === 'disabled';

  const handleToggle = () => {
    if (isDisabled) {
      return;
    }

    onTypeChange?.(getNextType(type));
  };

  return (
    <div
      id={id}
      role="checkbox"
      aria-checked={type === 'indeterminate' ? 'mixed' : type === 'checked'}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleToggle}
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
          handleToggle();
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
        <Checkbox
          size={size}
          type={toCheckboxType(type)}
          checked={toCheckboxChecked(type)}
          state={visualState}
          disabled={isDisabled}
          onCheckedChange={() => {
            handleToggle();
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
