import React, { useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type {
  ButtonGroupItemAlign,
  ButtonGroupItemData,
  ButtonGroupItemState,
  ButtonGroupItemType,
  ButtonGroupProps,
  ButtonGroupShape,
  ButtonGroupSize,
} from './ButtonGroup.types';

type ResolvedVisualState = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  badgeTextColor: string;
  iconColor: string;
};

type TypographyStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeConfig = {
  defaultPaddingX: number;
  defaultPaddingY: number;
  defaultGap: number;
  iconOnlyPadding: number;
  iconOnlyEdgeExtra: number;
  iconSize: number;
  textTypography: TypographyStyle;
  badgeTypography: TypographyStyle;
  badgeOuterPaddingX: number;
  badgeOuterPaddingY: number;
  badgeLabelPaddingX: number;
  roundedEdgeRadius: number;
};

const SIZE_CONFIG: Record<ButtonGroupSize, SizeConfig> = {
  lg: {
    defaultPaddingX: spacing.scale['14'],
    defaultPaddingY: spacing.scale['12'],
    defaultGap: spacing.scale['4'],
    iconOnlyPadding: spacing.scale['14'],
    iconOnlyEdgeExtra: spacing.scale['4'],
    iconSize: spacing.scale['20'],
    textTypography: typography.scale.bodyS.medium,
    badgeTypography: typography.scale.captionL.medium,
    badgeOuterPaddingX: spacing.scale['4'],
    badgeOuterPaddingY: spacing.scale['2'],
    badgeLabelPaddingX: spacing.scale['4'],
    roundedEdgeRadius: radius.scale.xl,
  },
  md: {
    defaultPaddingX: spacing.scale['12'],
    defaultPaddingY: spacing.scale['10'],
    defaultGap: spacing.scale['4'],
    iconOnlyPadding: spacing.scale['10'],
    iconOnlyEdgeExtra: spacing.scale['4'],
    iconSize: spacing.scale['20'],
    textTypography: typography.scale.captionL.medium,
    badgeTypography: typography.scale.captionM.medium,
    badgeOuterPaddingX: spacing.primitive['3'],
    badgeOuterPaddingY: spacing.scale['2'],
    badgeLabelPaddingX: spacing.primitive['3'],
    roundedEdgeRadius: radius.scale.xl,
  },
  sm: {
    defaultPaddingX: spacing.scale['10'],
    defaultPaddingY: spacing.scale['6'],
    defaultGap: spacing.scale['2'],
    iconOnlyPadding: spacing.scale['8'],
    iconOnlyEdgeExtra: spacing.scale['4'],
    iconSize: spacing.scale['16'],
    textTypography: typography.scale.captionL.medium,
    badgeTypography: typography.scale.captionM.medium,
    badgeOuterPaddingX: spacing.primitive['3'],
    badgeOuterPaddingY: spacing.scale['2'],
    badgeLabelPaddingX: spacing.primitive['3'],
    roundedEdgeRadius: radius.scale.lg,
  },
};

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;

function ScanIcon({ size, color }: { size: number; color: string }) {
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
      <path
        d="M3.67101 2.25701L11.414 10L10 11.414L3.68001 5.09401C2.5022 6.61297 1.91064 8.50522 2.01357 10.4246C2.1165 12.3439 2.90702 14.162 4.24052 15.5463C5.57402 16.9306 7.36134 17.7885 9.2755 17.9631C11.1897 18.1377 13.1027 17.6172 14.6646 16.497C16.2265 15.3768 17.3329 13.7317 17.7813 11.8626C18.2298 9.99354 17.9903 8.0255 17.1067 6.31853C16.2231 4.61157 14.7544 3.27979 12.9694 2.56685C11.1844 1.8539 9.20243 1.80746 7.386 2.43601L5.85001 0.900007C7.15259 0.305263 8.56807 -0.00170911 10 7.15715e-06C15.523 7.15715e-06 20 4.47701 20 10C20 15.523 15.523 20 10 20C4.47701 20 5.16123e-06 15.523 5.16123e-06 10C-0.00150219 8.51776 0.327177 7.05379 0.962167 5.71445C1.59716 4.37511 2.52251 3.19403 3.67101 2.25701V2.25701Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 15.556"
      style={{
        width: size,
        height: size,
        display: 'block',
        flexShrink: 0,
        color,
      }}
    >
      <path d="M12.172 6.778L6.808 1.414L8.222 0L16 7.778L8.222 15.556L6.808 14.142L12.172 8.778H0V6.778H12.172Z" fill="currentColor" />
    </svg>
  );
}

function resolveAlign(index: number, length: number, align: ButtonGroupItemAlign | undefined): ButtonGroupItemAlign {
  if (align) {
    return align;
  }

  if (index === 0) {
    return 'left';
  }

  if (index === length - 1) {
    return 'right';
  }

  return 'center';
}

function resolveState(
  item: ButtonGroupItemData,
  forceState: ButtonGroupItemState | undefined,
  hovered: boolean,
  focused: boolean,
  pressed: boolean,
): ButtonGroupItemState {
  if (item.disabled || item.state === 'disabled' || forceState === 'disabled') {
    return 'disabled';
  }

  if (item.state && item.state !== 'default') {
    return item.state;
  }

  if (forceState && forceState !== 'default') {
    return forceState;
  }

  if (pressed || item.active) {
    return 'active';
  }

  if (focused) {
    return 'focus';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function resolveVisualState(state: ButtonGroupItemState): ResolvedVisualState {
  const isFocused = state === 'focus';
  const isActive = state === 'active';
  const isDisabled = state === 'disabled';

  return {
    backgroundColor: isActive || state === 'hover' ? palette.gray['1'] : palette.base.white,
    borderColor: isFocused ? border.color.theme.action.focusLight : palette.gray['3'],
    borderWidth: isFocused ? border.width['2'] : border.width['1'],
    textColor: isDisabled ? textTokens.staticDarkQuaternary : isActive ? textTokens.staticDark : textTokens.staticDarkSecondary,
    badgeTextColor: isDisabled ? textTokens.staticDarkQuaternary : textTokens.staticDarkSecondary,
    iconColor: textTokens.staticDark,
  };
}

function resolveInlinePadding(
  type: ButtonGroupItemType,
  shape: ButtonGroupShape,
  align: ButtonGroupItemAlign,
  config: SizeConfig,
): { start: number; end: number; block: number } {
  if (type === 'default') {
    return {
      start: config.defaultPaddingX,
      end: config.defaultPaddingX,
      block: config.defaultPaddingY,
    };
  }

  if (shape === 'pill') {
    if (align === 'left') {
      return {
        start: config.iconOnlyPadding + config.iconOnlyEdgeExtra,
        end: config.iconOnlyPadding,
        block: config.iconOnlyPadding,
      };
    }

    if (align === 'right') {
      return {
        start: config.iconOnlyPadding,
        end: config.iconOnlyPadding + config.iconOnlyEdgeExtra,
        block: config.iconOnlyPadding,
      };
    }
  }

  return {
    start: config.iconOnlyPadding,
    end: config.iconOnlyPadding,
    block: config.iconOnlyPadding,
  };
}

function resolveEdgeRadius(shape: ButtonGroupShape, config: SizeConfig): number {
  return shape === 'pill' ? radius.scale.full : config.roundedEdgeRadius;
}

function ButtonGroupItemButton({
  size,
  shape,
  align,
  item,
  forceState,
  onItemClick,
  index,
}: {
  size: ButtonGroupSize;
  shape: ButtonGroupShape;
  align: ButtonGroupItemAlign;
  item: ButtonGroupItemData;
  forceState: ButtonGroupItemState | undefined;
  onItemClick: ButtonGroupProps['onItemClick'];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const type: ButtonGroupItemType = item.type ?? 'default';
  const config = SIZE_CONFIG[size];
  const visualState = resolveState(item, forceState, hovered, focused, pressed);
  const visual = resolveVisualState(visualState);
  const padding = resolveInlinePadding(type, shape, align, config);
  const edgeRadius = resolveEdgeRadius(shape, config);
  const showDivider = align !== 'right';
  const borderSideWidth = visualState === 'focus' ? visual.borderWidth : border.width['1'];
  const borderTopWidth = borderSideWidth;
  const borderBottomWidth = borderSideWidth;
  const borderLeftWidth = visualState === 'focus' || align === 'left' ? borderSideWidth : border.width['0'];
  const borderRightWidth = visualState === 'focus' || align === 'right' ? borderSideWidth : border.width['0'];

  const handleClick = () => {
    if (visualState === 'disabled') {
      return;
    }

    item.onClick?.();
    onItemClick?.(index, item);
  };

  const leadingIcon =
    item.leadingIcon ?? (type === 'default' && (item.showLeadingIcon ?? true) ? <ScanIcon size={config.iconSize} color={visual.iconColor} /> : null);
  const trailingIcon =
    item.trailingIcon ?? (type === 'default' && (item.showTrailingIcon ?? true) ? <ArrowRightIcon size={config.iconSize} color={visual.iconColor} /> : null);
  const centerIcon = item.icon ?? <ScanIcon size={config.iconSize} color={visual.iconColor} />;
  const showBadge = type === 'default' && (item.showBadge ?? true);
  const label = item.label ?? 'Button';
  const badgeLabel = item.badgeLabel ?? '16';

  return (
    <button
      type="button"
      disabled={visualState === 'disabled'}
      aria-pressed={item.active || visualState === 'active' || undefined}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setPressed(false);
      }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: type === 'default' ? config.defaultGap : spacing.scale['0'],
        margin: spacing.scale['0'],
        paddingInlineStart: padding.start,
        paddingInlineEnd: padding.end,
        paddingBlock: padding.block,
        borderStyle: 'solid',
        borderColor: visual.borderColor,
        borderTopWidth,
        borderBottomWidth,
        borderLeftWidth,
        borderRightWidth,
        borderTopLeftRadius: align === 'left' ? edgeRadius : radius.scale['0'],
        borderBottomLeftRadius: align === 'left' ? edgeRadius : radius.scale['0'],
        borderTopRightRadius: align === 'right' ? edgeRadius : radius.scale['0'],
        borderBottomRightRadius: align === 'right' ? edgeRadius : radius.scale['0'],
        backgroundColor: visual.backgroundColor,
        cursor: visualState === 'disabled' ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
      }}
    >
      {type === 'default' ? (
        <>
          {leadingIcon ? <span style={{ display: 'inline-flex', color: visual.iconColor }}>{leadingIcon}</span> : null}

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: spacing.scale['4'],
              paddingBlock: spacing.scale['0'],
              color: visual.textColor,
              fontFamily: config.textTypography.fontFamily,
              fontSize: config.textTypography.fontSize,
              fontWeight: config.textTypography.fontWeight,
              lineHeight: `${config.textTypography.lineHeight}px`,
              letterSpacing: `${config.textTypography.letterSpacing}px`,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>

          {showBadge ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: config.badgeOuterPaddingX,
                  paddingBlock: config.badgeOuterPaddingY,
                  borderStyle: 'solid',
                  borderWidth: border.width['1'],
                  borderColor: palette.gray['2a'],
                  borderRadius: size === 'lg' ? radius.scale.md : radius.scale.sm,
                  backgroundColor: palette.gray['2'],
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingInline: config.badgeLabelPaddingX,
                    paddingBlock: spacing.scale['0'],
                    color: visual.badgeTextColor,
                    fontFamily: config.badgeTypography.fontFamily,
                    fontSize: config.badgeTypography.fontSize,
                    fontWeight: config.badgeTypography.fontWeight,
                    lineHeight: `${config.badgeTypography.lineHeight}px`,
                    letterSpacing: `${config.badgeTypography.letterSpacing}px`,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {badgeLabel}
                </span>
              </span>
            </span>
          ) : null}

          {trailingIcon ? <span style={{ display: 'inline-flex', color: visual.iconColor }}>{trailingIcon}</span> : null}
        </>
      ) : (
        <span style={{ display: 'inline-flex', color: visual.iconColor }}>{centerIcon}</span>
      )}

      {showDivider ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -borderSideWidth,
            bottom: -borderSideWidth,
            right: visualState === 'focus' ? -borderSideWidth : spacing.scale['0'],
            width: spacing.scale['1'],
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: spacing.scale['0'],
              borderLeftStyle: 'solid',
              borderLeftWidth: border.width['1'],
              borderLeftColor: palette.gray['2'],
            }}
          />
        </span>
      ) : null}
    </button>
  );
}

export function ButtonGroup({
  size = 'lg',
  shape = 'rounded',
  items,
  forceState,
  onItemClick,
  role = 'group',
  style,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role={role}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: spacing.scale['0'],
        boxShadow: shadows.elevation.xs.css,
        ...style,
      }}
      {...props}
    >
      {items.map((item, index) => (
        <ButtonGroupItemButton
          key={item.key ?? `${index}-${item.label ?? item.type ?? 'item'}`}
          size={size}
          shape={shape}
          align={resolveAlign(index, items.length, item.align)}
          item={item}
          forceState={forceState}
          onItemClick={onItemClick}
          index={index}
        />
      ))}
    </div>
  );
}

