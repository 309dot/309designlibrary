import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import type { BannerDirection, BannerProps, BannerState } from './Banner.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;
const metal3DImage = '/components/Banner/assets/metal-3d-1.png';

const SIZE_293 = spacing.scale['288'] + spacing.primitive['5'];
const SIZE_272 = spacing.primitive['256'] + spacing.scale['16'];

function getTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function resolveState(forcedState: BannerState | undefined, hovered: boolean, interactive: boolean): BannerState {
  if (forcedState) {
    return forcedState;
  }

  if (interactive && hovered) {
    return 'hover';
  }

  return 'default';
}

function DefaultImage({ direction }: { direction: BannerDirection }) {
  const size = direction === 'horizontal' ? SIZE_293 : SIZE_272;

  return (
    <img
      src={metal3DImage}
      alt=""
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: 'block',
        objectFit: 'cover',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

export function Banner({
  direction = 'horizontal',
  state,
  interactive = true,
  badgeLabel = 'Badge',
  headline = 'Medium length headline',
  description = 'Design better and spend less time without restricting creative freedom.',
  showBadge = true,
  imageSlot,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: BannerProps) {
  const [hovered, setHovered] = useState(false);

  const resolvedState = resolveState(state, hovered, interactive);
  const isHorizontal = direction === 'horizontal';

  return (
    <article
      className={className}
      onMouseEnter={(event) => {
        if (!state && interactive) {
          setHovered(true);
        }
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!state && interactive) {
          setHovered(false);
        }
        onMouseLeave?.(event);
      }}
      style={{
        width: isHorizontal ? spacing.scale['640'] : spacing.scale['320'],
        minWidth: spacing.scale['320'],
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['24'],
        padding: spacing.scale['24'],
        borderRadius: radius.scale.xl,
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: resolvedState === 'hover' ? palette.green['1'] : palette.green['2'],
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['20'],
          flex: isHorizontal ? '1 0 0' : undefined,
          width: isHorizontal ? undefined : '100%',
          minWidth: isHorizontal ? spacing.scale['0'] : undefined,
        }}
      >
        {showBadge ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: spacing.scale['8'],
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: spacing.scale['4'],
                paddingBlock: spacing.scale['2'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['2a'],
                borderRadius: radius.scale.full,
                backgroundColor: palette.green['2'],
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: spacing.scale['4'],
                  paddingBlock: spacing.scale['0'],
                  color: palette.green['11'],
                  ...getTypographyStyle(typography.scale.captionL.medium),
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {badgeLabel}
              </span>
            </div>
          </div>
        ) : null}

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: spacing.scale['8'],
          }}
        >
          <h3
            style={{
              margin: spacing.scale['0'],
              width: '100%',
              color: textTokens.staticDark,
              ...getTypographyStyle(typography.scale.h6.semiBold),
            }}
          >
            {headline}
          </h3>
          <p
            style={{
              margin: spacing.scale['0'],
              width: '100%',
              color: textTokens.staticDarkSecondary,
              ...getTypographyStyle(typography.scale.bodyS.regular),
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: isHorizontal ? '1 0 0' : undefined,
          width: isHorizontal ? undefined : '100%',
          minHeight: isHorizontal ? spacing.scale['0'] : undefined,
        }}
      >
        {imageSlot ?? <DefaultImage direction={direction} />}
      </div>
    </article>
  );
}
