import React, { useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { InputProps, InputSize, InputTarget, InputVisualState } from './Input.types';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;
const textStatus = colors.semantic.theme.text.status;

const FLAG_BASE_SRC = '/components/Input/assets/flag-base.svg';
const FLAG_GROUP_SRC = '/components/Input/assets/flag-group.svg';
const FLAG_OVERLAY_SRC = '/components/Input/assets/flag-overlay.svg';
const EARTH_ICON_SRC = '/components/Input/assets/earth-line.svg';
const INFO_ICON_SRC = '/components/Input/assets/info-line.svg';
const CHEVRON_ICON_SRC = '/components/Input/assets/chevron-down.svg';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeStyle = {
  fieldPaddingX: number;
  fieldPaddingY: number;
  fieldRadius: number;
  inputContentGap: number;
  externalGap: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonGap: number;
};

const SIZE_STYLES: Record<InputSize, SizeStyle> = {
  md: {
    fieldPaddingX: spacing.scale['12'],
    fieldPaddingY: spacing.scale['10'],
    fieldRadius: radius.scale.xl,
    inputContentGap: spacing.scale['4'],
    externalGap: spacing.scale['4'],
    buttonPaddingX: spacing.scale['10'],
    buttonPaddingY: spacing.scale['10'],
    buttonGap: spacing.scale['2'],
  },
  xs: {
    fieldPaddingX: spacing.scale['8'],
    fieldPaddingY: spacing.scale['6'],
    fieldRadius: radius.scale.lg,
    inputContentGap: spacing.scale['2'],
    externalGap: spacing.scale['2'],
    buttonPaddingX: spacing.scale['8'],
    buttonPaddingY: spacing.scale['6'],
    buttonGap: spacing.scale['0'],
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
  forcedState: InputVisualState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
  value: string,
): InputVisualState {
  if (disabled || forcedState === 'disabled') {
    return 'disabled';
  }

  if (forcedState) {
    return forcedState;
  }

  if (focused) {
    return 'focus';
  }

  if (hovered) {
    return 'hover';
  }

  if (value.trim().length > 0) {
    return 'filled';
  }

  return 'default';
}

function getFieldBorderColor(target: InputTarget, state: InputVisualState): string {
  if (target === 'destructive') {
    if (state === 'focus') {
      return palette.red['6'];
    }

    if (state === 'hover') {
      return palette.red['5'];
    }

    if (state === 'disabled') {
      return palette.gray['2'];
    }

    return palette.red['4'];
  }

  if (state === 'focus') {
    return palette.purple['6'];
  }

  if (state === 'hover') {
    return palette.gray['4'];
  }

  if (state === 'disabled') {
    return palette.gray['2'];
  }

  return palette.gray['3'];
}

function getFieldFocusShadow(target: InputTarget, state: InputVisualState): string {
  if (state !== 'focus') {
    return 'none';
  }

  return target === 'destructive' ? shadows.focusRing.lightDestructive.css : shadows.focusRing.light.css;
}

function FlagIcon({ disabled }: { disabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: spacing.scale['20'],
        height: spacing.scale['20'],
        overflow: 'hidden',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        mixBlendMode: disabled ? 'luminosity' : 'normal',
      }}
    >
      <img src={FLAG_BASE_SRC} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
      <span style={{ position: 'absolute', inset: spacing.scale['0'] }}>
        <img src={FLAG_GROUP_SRC} alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
      </span>
      <img src={FLAG_OVERLAY_SRC} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </span>
  );
}

function IconImage({ src, size, disabled }: { src: string; size: number; disabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <img src={src} alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
    </span>
  );
}

export function Input({
  id,
  className,
  style,
  type = 'default',
  size = 'md',
  target = 'default',
  state,
  disabled = false,
  label = 'Label',
  optionalLabel = '(optional)',
  helperText = 'Helper text',
  placeholder = 'Placeholder',
  value,
  defaultValue = '',
  externalLabel = 'Company',
  buttonLabel = 'Button',
  leadDropdownLabel = 'UK',
  tailDropdownLabel = 'EUR',
  badgeLabel = '⌘K',
  showLabel = true,
  showHelper = true,
  showFlag = true,
  showLeadDropdown = true,
  showLeadIcon = true,
  showBadge = true,
  showTailIcon = true,
  showTailDropdown = true,
  leadIcon,
  tailIcon,
  inputAriaLabel = 'Input field',
  onValueChange,
  onButtonClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: InputProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const sizeStyle = SIZE_STYLES[size];

  const resolvedValue = value ?? uncontrolledValue;

  const resolvedState = resolveVisualState(state, disabled, hovered, focused, resolvedValue);
  const componentDisabled = resolvedState === 'disabled';

  const hasFilledValue = resolvedState === 'filled' || resolvedValue.trim().length > 0;

  const fieldBorderColor = getFieldBorderColor(target, resolvedState);
  const fieldFocusShadow = getFieldFocusShadow(target, resolvedState);
  const helperColor =
    componentDisabled
      ? textBase.staticDarkQuaternary
      : target === 'destructive'
      ? textStatus.destructive
      : textBase.staticDarkTertiary;

  const bodyTextColor = componentDisabled ? textBase.staticDarkQuaternary : textBase.staticDark;
  const tertiaryTextColor = componentDisabled ? textBase.staticDarkQuaternary : textBase.staticDarkTertiary;
  const secondaryTextColor = componentDisabled ? textBase.staticDarkQuaternary : textBase.staticDarkSecondary;

  const containerShadow = componentDisabled ? 'none' : shadows.elevation.xs.css;
  const sideBorderColor = componentDisabled ? palette.gray['2'] : palette.gray['3'];

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (event) => {
    setHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
    setHovered(false);
    onMouseLeave?.(event);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }

    onValueChange?.(event.target.value);
  };

  const fieldTypography = toTypographyStyle(typography.scale.captionL.regular);
  const mediumTypography = toTypographyStyle(typography.scale.captionL.medium);

  const leftFieldRadius = {
    borderTopLeftRadius: sizeStyle.fieldRadius,
    borderBottomLeftRadius: sizeStyle.fieldRadius,
    borderTopRightRadius: radius.scale['0'],
    borderBottomRightRadius: radius.scale['0'],
  };

  const rightFieldRadius = {
    borderTopLeftRadius: radius.scale['0'],
    borderBottomLeftRadius: radius.scale['0'],
    borderTopRightRadius: sizeStyle.fieldRadius,
    borderBottomRightRadius: sizeStyle.fieldRadius,
  };

  const fullFieldRadius = {
    borderRadius: sizeStyle.fieldRadius,
  };

  return (
    <div
      id={id}
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['8'],
        minWidth: spacing.scale['144'],
        width: spacing.scale['400'],
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {showLabel ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.scale['0'],
            padding: spacing.scale['0'],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.scale['4'],
              paddingInline: spacing.scale['0'],
              paddingBlock: spacing.scale['2'],
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                color: textBase.staticDark,
                ...mediumTypography,
              }}
            >
              {label}
            </span>
            <span
              style={{
                color: textBase.staticDarkTertiary,
                ...mediumTypography,
              }}
            >
              {optionalLabel}
            </span>
          </div>
        </div>
      ) : null}

      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'stretch',
          gap: spacing.scale['0'],
          boxShadow: containerShadow,
        }}
      >
        {type === 'external' ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: sizeStyle.externalGap,
              paddingInline: sizeStyle.fieldPaddingX,
              paddingBlock: sizeStyle.fieldPaddingY,
              borderStyle: 'solid',
              borderTopWidth: border.width['1'],
              borderBottomWidth: border.width['1'],
              borderLeftWidth: border.width['1'],
              borderRightWidth: border.width['0'],
              borderColor: sideBorderColor,
              backgroundColor: palette.gray['1'],
              ...leftFieldRadius,
            }}
          >
            {leadIcon ? (
              <>{leadIcon ?? <IconImage src={EARTH_ICON_SRC} size={spacing.scale['20']} disabled={componentDisabled} />}</>
            ) : null}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.scale['0'],
                paddingInline: spacing.scale['4'],
                paddingBlock: spacing.scale['0'],
              }}
            >
              <span
                style={{
                  color: bodyTextColor,
                  ...fieldTypography,
                  whiteSpace: 'nowrap',
                }}
              >
                {externalLabel}
              </span>
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            alignItems: 'center',
            minWidth: spacing.scale['0'],
            paddingInline: sizeStyle.fieldPaddingX,
            paddingBlock: sizeStyle.fieldPaddingY,
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: fieldBorderColor,
            backgroundColor: palette.base.white,
            boxShadow: fieldFocusShadow,
            overflow: 'hidden',
            ...(type === 'default' ? fullFieldRadius : type === 'external' ? rightFieldRadius : leftFieldRadius),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale['4'],
              flex: '1 0 0',
              minWidth: spacing.scale['0'],
            }}
          >
            {type !== 'external' && showFlag ? <FlagIcon disabled={componentDisabled} /> : null}

            {type !== 'external' && showLeadDropdown ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.scale['2'],
                  paddingLeft: spacing.scale['4'],
                  paddingRight: spacing.scale['0'],
                  paddingBlock: spacing.scale['0'],
                }}
              >
                <span
                  style={{
                    color: bodyTextColor,
                    ...mediumTypography,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {leadDropdownLabel}
                </span>
                <IconImage src={CHEVRON_ICON_SRC} size={spacing.scale['16']} disabled={componentDisabled} />
              </div>
            ) : null}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sizeStyle.inputContentGap,
                flex: '1 0 0',
                minWidth: spacing.scale['0'],
              }}
            >
              {type !== 'external' && showLeadIcon ? (
                <>{leadIcon ?? <IconImage src={EARTH_ICON_SRC} size={spacing.scale['20']} disabled={componentDisabled} />}</>
              ) : null}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: '1 0 0',
                  minWidth: spacing.scale['0'],
                  paddingInline: spacing.scale['4'],
                  paddingBlock: spacing.scale['0'],
                }}
              >
                <input
                  aria-label={inputAriaLabel}
                  value={hasFilledValue ? (resolvedValue || 'Filled text') : resolvedValue}
                  placeholder={placeholder}
                  disabled={componentDisabled}
                  onChange={handleInputChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    flex: '1 0 0',
                    minWidth: spacing.scale['0'],
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: hasFilledValue ? bodyTextColor : tertiaryTextColor,
                    padding: spacing.scale['0'],
                    margin: spacing.scale['0'],
                    ...fieldTypography,
                  }}
                />
              </div>
            </div>

            {showBadge ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'flex-start',
                  paddingInline: spacing.scale['4'],
                  paddingBlock: spacing.scale['0'],
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: palette.gray['2'],
                    borderRadius: radius.scale.sm,
                    paddingInline: spacing.scale['2'],
                    paddingBlock: spacing.scale['0'],
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingInline: spacing.scale['4'],
                      paddingBlock: spacing.scale['0'],
                    }}
                  >
                    <span
                      style={{
                        color: secondaryTextColor,
                        ...mediumTypography,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {showTailIcon ? <>{tailIcon ?? <IconImage src={INFO_ICON_SRC} size={spacing.scale['20']} disabled={componentDisabled} />}</> : null}

            {showTailDropdown ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.scale['2'],
                  paddingLeft: spacing.scale['4'],
                  paddingRight: spacing.scale['0'],
                  paddingBlock: spacing.scale['0'],
                }}
              >
                <span
                  style={{
                    color: bodyTextColor,
                    ...mediumTypography,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tailDropdownLabel}
                </span>
                <IconImage src={CHEVRON_ICON_SRC} size={spacing.scale['16']} disabled={componentDisabled} />
              </div>
            ) : null}
          </div>
        </div>

        {type === 'button' ? (
          <button
            type="button"
            disabled={componentDisabled}
            onClick={onButtonClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sizeStyle.buttonGap,
              paddingInline: sizeStyle.buttonPaddingX,
              paddingBlock: sizeStyle.buttonPaddingY,
              borderStyle: 'solid',
              borderTopWidth: border.width['1'],
              borderBottomWidth: border.width['1'],
              borderRightWidth: border.width['1'],
              borderLeftWidth: border.width['0'],
              borderColor: sideBorderColor,
              backgroundColor: palette.base.transparent,
              cursor: componentDisabled ? 'not-allowed' : 'pointer',
              ...rightFieldRadius,
            }}
          >
            <span
              style={{
                color: bodyTextColor,
                ...mediumTypography,
                whiteSpace: 'nowrap',
              }}
            >
              {buttonLabel}
            </span>
          </button>
        ) : null}
      </div>

      {showHelper ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.scale['4'],
            paddingInline: spacing.scale['0'],
            paddingBlock: spacing.scale['2'],
          }}
        >
          <IconImage src={INFO_ICON_SRC} size={spacing.scale['16']} disabled={componentDisabled} />
          <span
            style={{
              color: helperColor,
              ...fieldTypography,
              whiteSpace: 'nowrap',
            }}
          >
            {helperText}
          </span>
        </div>
      ) : null}
    </div>
  );
}
