import React, { useId, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { AccordionProps, AccordionSize, AccordionVisualState } from './Accordion.types';

type InteractionState = 'default' | 'hover' | 'focused' | 'disabled';

type TypographyStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type VisualStyle = {
  backgroundColor: string;
  borderColor: string;
  boxShadow: string;
  titleColor: string;
  descriptionColor: string;
  iconColor: string;
};

const SIZE_CONFIG: Record<
  AccordionSize,
  {
    leadIconPaddingY: number;
    titleTypography: TypographyStyle;
    descriptionTypography: TypographyStyle;
  }
> = {
  lg: {
    leadIconPaddingY: spacing.primitive['3'],
    titleTypography: typography.scale.bodyM.medium,
    descriptionTypography: typography.scale.bodyS.regular,
  },
  md: {
    leadIconPaddingY: spacing.scale['2'],
    titleTypography: typography.scale.bodyS.medium,
    descriptionTypography: typography.scale.captionL.regular,
  },
};

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;
const iconTokens = colors.semantic.theme.icon.base;

function resolveInteractionState(
  disabled: boolean,
  forceState: AccordionVisualState | undefined,
  hovered: boolean,
  focused: boolean,
): InteractionState {
  if (disabled || forceState === 'disabled') {
    return 'disabled';
  }

  if (forceState === 'default') {
    return 'default';
  }

  if (forceState === 'focused') {
    return 'focused';
  }

  if (forceState === 'hover') {
    return 'hover';
  }

  if (focused) {
    return 'focused';
  }

  if (hovered) {
    return 'hover';
  }

  return 'default';
}

function resolveVisualStyle(expanded: boolean, interactionState: InteractionState): VisualStyle {
  if (interactionState === 'disabled') {
    return {
      backgroundColor: expanded ? palette.gray['1'] : palette.base.white,
      borderColor: palette.gray['2a'],
      boxShadow: 'none',
      titleColor: textTokens.staticDarkSecondary,
      descriptionColor: textTokens.staticDarkSecondary,
      iconColor: iconTokens.staticDarkSecondary,
    };
  }

  if (interactionState === 'focused') {
    return {
      backgroundColor: expanded ? palette.gray['1'] : palette.base.white,
      borderColor: border.color.theme.action.focusLight,
      boxShadow: shadows.focusRing.light.css,
      titleColor: textTokens.staticDark,
      descriptionColor: textTokens.staticDarkSecondary,
      iconColor: iconTokens.staticDark,
    };
  }

  if (expanded) {
    return {
      backgroundColor: interactionState === 'hover' ? palette.gray['2'] : palette.gray['1'],
      borderColor: palette.gray['2a'],
      boxShadow: shadows.elevation.xs.css,
      titleColor: textTokens.staticDark,
      descriptionColor: textTokens.staticDarkSecondary,
      iconColor: iconTokens.staticDark,
    };
  }

  return {
    backgroundColor: interactionState === 'hover' ? palette.gray['1'] : palette.base.white,
    borderColor: palette.gray['2a'],
    boxShadow: 'none',
    titleColor: textTokens.staticDark,
    descriptionColor: textTokens.staticDarkSecondary,
    iconColor: iconTokens.staticDark,
  };
}

function CompassIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      style={{
        width: spacing.scale['20'],
        height: spacing.scale['20'],
        display: 'block',
        flexShrink: 0,
        color,
      }}
    >
      <path
        d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18V18ZM13.446 7.968L7.968 13.446C7.38509 13.1013 6.89871 12.6149 6.554 12.032L12.032 6.554C12.6149 6.89871 13.1013 7.38509 13.446 7.968V7.968Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 11.6667 11.6667"
      style={{
        width: spacing.scale['12'],
        height: spacing.scale['12'],
        display: 'block',
      }}
    >
      <path d="M5 5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667H0V5H5Z" fill="currentColor" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 11.6667 1.66667"
      style={{
        width: spacing.scale['12'],
        height: spacing.scale['2'],
        display: 'block',
      }}
    >
      <path d="M0 0H11.6667V1.66667H0V0Z" fill="currentColor" />
    </svg>
  );
}

export function Accordion({
  title,
  description,
  size = 'lg',
  expanded,
  defaultExpanded = false,
  disabled = false,
  showLeadingIcon = true,
  leadingIcon,
  forceState,
  onExpandedChange,
  children,
  id,
  style,
  ...props
}: AccordionProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const baseId = useId().replace(/:/g, '');

  const sizeConfig = SIZE_CONFIG[size];
  const resolvedExpanded = expanded ?? uncontrolledExpanded;
  const interactionState = resolveInteractionState(disabled, forceState, hovered, focused);
  const visualStyle = useMemo(
    () => resolveVisualStyle(resolvedExpanded, interactionState),
    [resolvedExpanded, interactionState],
  );
  const rootId = id ?? `accordion-${baseId}`;
  const triggerId = `${rootId}-trigger`;
  const panelId = `${rootId}-panel`;
  const isDisabled = interactionState === 'disabled';
  const hasPanelContent = Boolean(description || children);

  const onToggle = () => {
    if (isDisabled) {
      return;
    }

    const next = !resolvedExpanded;

    if (expanded === undefined) {
      setUncontrolledExpanded(next);
    }

    onExpandedChange?.(next);
  };

  return (
    <div
      id={rootId}
      aria-disabled={isDisabled || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: resolvedExpanded && hasPanelContent ? spacing.scale['4'] : spacing.scale['0'],
        width: '100%',
        paddingInline: spacing.scale['20'],
        paddingBlock: spacing.scale['16'],
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: visualStyle.borderColor,
        borderRadius: radius.scale.lg,
        backgroundColor: visualStyle.backgroundColor,
        boxShadow: visualStyle.boxShadow,
        overflow: 'clip',
        ...style,
      }}
      {...props}
    >
      <button
        id={triggerId}
        type="button"
        aria-controls={hasPanelContent ? panelId : undefined}
        aria-expanded={resolvedExpanded}
        disabled={isDisabled}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.scale['12'],
          width: '100%',
          margin: spacing.scale['0'],
          padding: spacing.scale['0'],
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        {showLeadingIcon ? (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: spacing.scale['0'],
              paddingBlock: sizeConfig.leadIconPaddingY,
              flexShrink: 0,
              color: visualStyle.iconColor,
            }}
          >
            {leadingIcon ?? <CompassIcon color={visualStyle.iconColor} />}
          </span>
        ) : null}

        <span
          style={{
            flex: 1,
            minWidth: 0,
            color: visualStyle.titleColor,
            fontFamily: sizeConfig.titleTypography.fontFamily,
            fontSize: sizeConfig.titleTypography.fontSize,
            fontWeight: sizeConfig.titleTypography.fontWeight,
            lineHeight: `${sizeConfig.titleTypography.lineHeight}px`,
            letterSpacing: `${sizeConfig.titleTypography.letterSpacing}px`,
          }}
        >
          {title}
        </span>

        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: spacing.scale['20'],
            height: spacing.scale['20'],
            flexShrink: 0,
            color: visualStyle.iconColor,
            marginTop: spacing.scale['2'],
          }}
        >
          {resolvedExpanded ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>

      {resolvedExpanded && hasPanelContent ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          style={{
            display: 'grid',
            gap: spacing.scale['0'],
            paddingInlineStart: showLeadingIcon ? spacing.scale['32'] : spacing.scale['0'],
          }}
        >
          {description ? (
            <p
              style={{
                margin: spacing.scale['0'],
                color: visualStyle.descriptionColor,
                fontFamily: sizeConfig.descriptionTypography.fontFamily,
                fontSize: sizeConfig.descriptionTypography.fontSize,
                fontWeight: sizeConfig.descriptionTypography.fontWeight,
                lineHeight: `${sizeConfig.descriptionTypography.lineHeight}px`,
                letterSpacing: `${sizeConfig.descriptionTypography.letterSpacing}px`,
              }}
            >
              {description}
            </p>
          ) : null}

          {children ? <div style={{ paddingTop: spacing.scale['12'], width: '100%' }}>{children}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

