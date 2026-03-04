import React, { useId, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { TooltipPlacement, TooltipProps, TooltipSize, TooltipTriggerProps } from './Tooltip.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeConfig = {
  paddingX: number;
  paddingY: number;
  radiusValue: number;
  textTypography: TypographyToken;
  headlineTypography?: TypographyToken;
  descriptionTypography?: TypographyToken;
};

const SIZE_CONFIG: Record<TooltipSize, SizeConfig> = {
  sm: {
    paddingX: spacing.scale['8'],
    paddingY: spacing.scale['4'],
    radiusValue: radius.scale.sm,
    textTypography: typography.scale.captionM.regular,
  },
  md: {
    paddingX: spacing.scale['12'],
    paddingY: spacing.scale['8'],
    radiusValue: radius.scale.sm,
    textTypography: typography.scale.captionM.regular,
  },
  lg: {
    paddingX: spacing.scale['16'],
    paddingY: spacing.scale['12'],
    radiusValue: radius.scale.md,
    textTypography: typography.scale.captionM.regular,
    headlineTypography: typography.scale.captionM.medium,
    descriptionTypography: typography.scale.captionM.regular,
  },
};

const ARROW_WIDTH = spacing.scale['14'];
const ARROW_HEIGHT = spacing.scale['4'];
const ARROW_SIDE_WIDTH = spacing.scale['4'];
const ARROW_SIDE_HEIGHT = spacing.scale['14'];
const ARROW_CONTAINER_SIZE = spacing.scale['6'];
const ARROW_OFFSET = spacing.scale['10'];
const TOOLTIP_MAX_WIDTH = spacing.scale['320'];
const LG_TEXT_MAX_WIDTH = spacing.scale['192'] + spacing.scale['8'];
const TRIGGER_SIZE = spacing.scale['24'];
const TRIGGER_ICON_SIZE = spacing.scale['14'];
const TRIGGER_TOOLTIP_OFFSET = spacing.scale['24'] + spacing.scale['6'];

const boxBackground = colors.semantic.theme.background.surface.default;
const boxBorderColor = border.color.theme.action.normal;
const textBase = colors.semantic.theme.text.base;
const iconBase = colors.semantic.theme.icon.base;

const LG_SUPPORTED_PLACEMENTS: ReadonlySet<TooltipPlacement> = new Set([
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'topLeft',
  'topCenter',
  'topRight',
]);

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function normalizePlacement(size: TooltipSize, placement: TooltipPlacement): TooltipPlacement {
  if (size !== 'lg') {
    return placement;
  }

  if (LG_SUPPORTED_PLACEMENTS.has(placement)) {
    return placement;
  }

  return 'topCenter';
}

function resolveArrowAlign(placement: TooltipPlacement): 'flex-start' | 'center' | 'flex-end' {
  if (placement === 'bottomLeft' || placement === 'topLeft') {
    return 'flex-start';
  }

  if (placement === 'bottomRight' || placement === 'topRight') {
    return 'flex-end';
  }

  return 'center';
}

function TooltipArrow({
  direction,
  backgroundColor,
  borderColor,
}: {
  direction: 'up' | 'down' | 'left' | 'right';
  backgroundColor: string;
  borderColor: string;
}) {
  if (direction === 'up') {
    return (
      <svg width={ARROW_WIDTH} height={ARROW_HEIGHT} viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`} aria-hidden="true" style={{ display: 'block' }}>
        <path d={`M 0 ${ARROW_HEIGHT} L ${ARROW_WIDTH / 2} 0 L ${ARROW_WIDTH} ${ARROW_HEIGHT} Z`} fill={backgroundColor} stroke={borderColor} strokeWidth={border.width['1']} />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg width={ARROW_WIDTH} height={ARROW_HEIGHT} viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`} aria-hidden="true" style={{ display: 'block' }}>
        <path d={`M 0 0 L ${ARROW_WIDTH / 2} ${ARROW_HEIGHT} L ${ARROW_WIDTH} 0 Z`} fill={backgroundColor} stroke={borderColor} strokeWidth={border.width['1']} />
      </svg>
    );
  }

  if (direction === 'left') {
    return (
      <svg
        width={ARROW_SIDE_WIDTH}
        height={ARROW_SIDE_HEIGHT}
        viewBox={`0 0 ${ARROW_SIDE_WIDTH} ${ARROW_SIDE_HEIGHT}`}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <path d={`M ${ARROW_SIDE_WIDTH} 0 L 0 ${ARROW_SIDE_HEIGHT / 2} L ${ARROW_SIDE_WIDTH} ${ARROW_SIDE_HEIGHT} Z`} fill={backgroundColor} stroke={borderColor} strokeWidth={border.width['1']} />
      </svg>
    );
  }

  return (
    <svg
      width={ARROW_SIDE_WIDTH}
      height={ARROW_SIDE_HEIGHT}
      viewBox={`0 0 ${ARROW_SIDE_WIDTH} ${ARROW_SIDE_HEIGHT}`}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path d={`M 0 0 L ${ARROW_SIDE_WIDTH} ${ARROW_SIDE_HEIGHT / 2} L 0 ${ARROW_SIDE_HEIGHT} Z`} fill={backgroundColor} stroke={borderColor} strokeWidth={border.width['1']} />
    </svg>
  );
}

function TooltipBox({
  size,
  text,
  headline,
  description,
}: {
  size: TooltipSize;
  text: string;
  headline: string;
  description: string;
}) {
  const config = SIZE_CONFIG[size];

  if (size === 'lg') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: config.paddingX,
          paddingBlock: config.paddingY,
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: boxBorderColor,
          borderRadius: config.radiusValue,
          backgroundColor: boxBackground,
          boxShadow: shadows.tooltip.sm.css,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: spacing.scale['4'],
          }}
        >
          <p
            style={{
              margin: spacing.scale['0'],
              maxWidth: LG_TEXT_MAX_WIDTH,
              color: textBase.staticDark,
              whiteSpace: 'normal',
              ...toTypographyStyle(config.headlineTypography ?? typography.scale.captionM.medium),
            }}
          >
            {headline}
          </p>
          <p
            style={{
              margin: spacing.scale['0'],
              maxWidth: LG_TEXT_MAX_WIDTH,
              color: textBase.staticDarkSecondary,
              whiteSpace: 'normal',
              ...toTypographyStyle(config.descriptionTypography ?? typography.scale.captionM.regular),
            }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: config.paddingX,
        paddingBlock: config.paddingY,
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: boxBorderColor,
        borderRadius: config.radiusValue,
        backgroundColor: boxBackground,
        boxShadow: shadows.tooltip.sm.css,
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          margin: spacing.scale['0'],
          color: textBase.staticDark,
          whiteSpace: 'nowrap',
          ...toTypographyStyle(config.textTypography),
        }}
      >
        {text}
      </p>
    </div>
  );
}

function ArrowWrapper({ placement }: { placement: TooltipPlacement }) {
  const align = resolveArrowAlign(placement);

  if (placement === 'leftSide' || placement === 'rightSide') {
    return (
      <div
        style={{
          width: ARROW_CONTAINER_SIZE,
          alignSelf: 'stretch',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: placement === 'leftSide' ? 'flex-end' : 'flex-start',
          overflow: 'hidden',
        }}
      >
        <TooltipArrow direction={placement === 'leftSide' ? 'left' : 'right'} backgroundColor={boxBackground} borderColor={boxBorderColor} />
      </div>
    );
  }

  const isTop = placement === 'topLeft' || placement === 'topCenter' || placement === 'topRight';

  return (
    <div
      style={{
        height: ARROW_CONTAINER_SIZE,
        width: '100%',
        display: 'inline-flex',
        alignItems: isTop ? 'flex-end' : 'flex-start',
        justifyContent: align,
        paddingLeft: align === 'flex-start' ? ARROW_OFFSET : spacing.scale['0'],
        paddingRight: align === 'flex-end' ? ARROW_OFFSET : spacing.scale['0'],
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <TooltipArrow direction={isTop ? 'up' : 'down'} backgroundColor={boxBackground} borderColor={boxBorderColor} />
    </div>
  );
}

export function Tooltip({
  size = 'sm',
  placement = 'bottomCenter',
  text = 'Tooltip text',
  headline = 'Tooltip headline',
  description = 'Tooltips display informative text when users hover over, focus on, or tap an element',
  className,
  style,
  ...rest
}: TooltipProps) {
  const resolvedPlacement = normalizePlacement(size, placement);
  const isSidePlacement = resolvedPlacement === 'leftSide' || resolvedPlacement === 'rightSide';
  const isTopPlacement = resolvedPlacement === 'topLeft' || resolvedPlacement === 'topCenter' || resolvedPlacement === 'topRight';

  const box = <TooltipBox size={size} text={text} headline={headline} description={description} />;
  const arrow = <ArrowWrapper placement={resolvedPlacement} />;

  return (
    <div
      {...rest}
      role="tooltip"
      className={className}
      style={{
        display: 'inline-flex',
        maxWidth: TOOLTIP_MAX_WIDTH,
        alignItems: 'stretch',
        flexDirection: isSidePlacement ? 'row' : 'column',
        ...(isTopPlacement && !isSidePlacement ? { isolation: 'isolate' } : {}),
        ...style,
      }}
    >
      {isSidePlacement ? (resolvedPlacement === 'leftSide' ? <>{arrow}{box}</> : <>{box}{arrow}</>) : isTopPlacement ? <>{arrow}{box}</> : <>{box}{arrow}</>}
    </div>
  );
}

export function TooltipTrigger({
  active,
  defaultActive = false,
  disabled = false,
  onActiveChange,
  showTooltipOnActive = true,
  tooltipProps,
  tooltipStyle,
  onClick,
  className,
  style,
  ...rest
}: TooltipTriggerProps) {
  const isControlled = active !== undefined;
  const [internalActive, setInternalActive] = useState(defaultActive);
  const resolvedActive = isControlled ? Boolean(active) : internalActive;

  const tooltipId = useId();
  const visibleTooltip = showTooltipOnActive && resolvedActive;

  const resolvedTooltipProps: TooltipProps = {
    size: 'sm',
    placement: 'bottomCenter',
    text: 'Tooltip text',
    ...tooltipProps,
  };

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const next = !resolvedActive;

    if (!isControlled) {
      setInternalActive(next);
    }

    onActiveChange?.(next);
    onClick?.(event);
  };

  const iconBackgroundColor = resolvedActive ? iconBase.staticDark : iconBase.staticDarkQuaternary;

  return (
    <button
      {...rest}
      type="button"
      aria-pressed={resolvedActive}
      aria-disabled={disabled || undefined}
      aria-describedby={visibleTooltip ? tooltipId : undefined}
      disabled={disabled}
      onClick={handleToggle}
      className={className}
      style={{
        width: TRIGGER_SIZE,
        height: TRIGGER_SIZE,
        borderStyle: 'solid',
        borderWidth: border.width['0'],
        borderRadius: radius.scale.full,
        backgroundColor: colors.primitive.palette.base.transparent,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: TRIGGER_ICON_SIZE,
          height: TRIGGER_ICON_SIZE,
          borderRadius: radius.scale.full,
          backgroundColor: iconBackgroundColor,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconBase.staticWhite,
          ...toTypographyStyle(typography.scale.captionS.medium),
          lineHeight: `${TRIGGER_ICON_SIZE}px`,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        i
      </span>

      {visibleTooltip ? (
        <Tooltip
          {...resolvedTooltipProps}
          id={tooltipId}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: TRIGGER_TOOLTIP_OFFSET,
            ...tooltipStyle,
          }}
        />
      ) : null}
    </button>
  );
}

export default Tooltip;
