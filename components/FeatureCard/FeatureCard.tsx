import React from 'react';
import type { CSSProperties } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type {
  FeatureCardAction,
  FeatureCardAlignment,
  FeatureCardProps,
  FeatureCardType,
} from './FeatureCard.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type GradientToken = {
  rotation: number;
  stops: ReadonlyArray<{
    position: number;
    color: string;
  }>;
};

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;
const gradientSolid04 = colors.gradients.solid['04'] as GradientToken;

const SIZE_260 = spacing.primitive['256'] + spacing.scale['4'];
const SIZE_280 = spacing.scale['288'] - spacing.scale['8'];

function getTypographyStyle(token: TypographyToken): CSSProperties {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function toLinearGradient(token: GradientToken): string {
  const stops = token.stops.map((stop) => `${stop.color} ${stop.position * 100}%`).join(', ');
  return `linear-gradient(${token.rotation}deg, ${stops})`;
}

function ActionButton({
  action,
  appearance,
}: {
  action: FeatureCardAction;
  appearance: 'primary' | 'secondary';
}) {
  const isPrimary = appearance === 'primary';

  return (
    <button
      type="button"
      onClick={action.onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.scale['2'],
        paddingInline: spacing.scale['10'],
        paddingBlock: spacing.scale['6'],
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: isPrimary ? palette.gray['13'] : palette.gray['3'],
        borderRadius: radius.scale.lg,
        backgroundColor: isPrimary ? palette.gray['13'] : palette.base.white,
        color: isPrimary ? palette.base.white : textTokens.staticDark,
        boxShadow: shadows.elevation.xs.css,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: spacing.scale['4'],
          paddingBlock: spacing.scale['0'],
          ...getTypographyStyle(typography.scale.captionL.medium),
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {action.label}
      </span>
    </button>
  );
}

function DefaultCustomSlot() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: SIZE_280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: border.width['1'],
        borderColor: palette.purple['8'],
        borderRadius: radius.scale.xl,
        backgroundColor: palette.purple['2'],
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          ...getTypographyStyle(typography.scale.h6.medium),
          color: palette.purple['11'],
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        Slot
      </span>
    </div>
  );
}

function resolveAlignmentOrder(alignment: FeatureCardAlignment) {
  return alignment === 'imageFirst' ? (['image', 'content'] as const) : (['content', 'image'] as const);
}

function ImageBlock({ flat, imageSlot }: { flat: boolean; imageSlot: FeatureCardProps['imageSlot'] }) {
  return (
    <div
      style={{
        flex: '1 0 0',
        minWidth: spacing.scale['320'],
        minHeight: SIZE_260,
        borderRadius: flat ? radius.scale.xxl : radius.scale['0'],
        backgroundImage: toLinearGradient(gradientSolid04),
        backgroundColor: gradientSolid04.stops[0]?.color ?? palette.gray['1'],
        overflow: 'hidden',
      }}
    >
      {imageSlot}
    </div>
  );
}

function ContentBlock({
  type,
  showBadge,
  badgeLabel,
  headline,
  description,
  showActions,
  primaryAction,
  secondaryAction,
}: {
  type: FeatureCardType;
  showBadge: boolean;
  badgeLabel: string;
  headline: string;
  description: string;
  showActions: boolean;
  primaryAction: FeatureCardAction;
  secondaryAction: FeatureCardAction;
}) {
  const isFlat = type === 'flat';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: spacing.scale['20'],
        flex: '1 0 0',
        minWidth: spacing.scale['320'],
        padding: isFlat ? spacing.scale['0'] : spacing.scale['24'],
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
          padding: spacing.scale['0'],
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

      {showActions ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.scale['8'],
            flexWrap: 'wrap',
          }}
        >
          <ActionButton action={primaryAction} appearance="primary" />
          <ActionButton action={secondaryAction} appearance="secondary" />
        </div>
      ) : null}
    </div>
  );
}

export function FeatureCard({
  type = 'elevated',
  alignment = 'imageFirst',
  badgeLabel = 'Badge',
  headline = 'Medium length headline',
  description = 'Design better and spend less time without restricting creative freedom.',
  primaryAction = { label: 'Button' },
  secondaryAction = { label: 'Button' },
  showBadge = true,
  showActions = true,
  imageSlot,
  customSlot,
  className,
  style,
  ...props
}: FeatureCardProps) {
  const rootStyle: CSSProperties = {
    width: spacing.scale['360'],
    minWidth: spacing.scale['320'],
    boxSizing: 'border-box',
  };

  if (type === 'custom') {
    return (
      <article
        className={className}
        style={{
          ...rootStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['0'],
          padding: spacing.scale['24'],
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: palette.gray['3'],
          borderRadius: radius.scale.xxl,
          backgroundColor: palette.base.white,
          boxShadow: shadows.elevation.xs.css,
          ...style,
        }}
        {...props}
      >
        {customSlot ?? <DefaultCustomSlot />}
      </article>
    );
  }

  const isFlat = type === 'flat';
  const [first, second] = resolveAlignmentOrder(alignment);

  const image = <ImageBlock flat={isFlat} imageSlot={imageSlot} />;
  const content = (
    <ContentBlock
      type={type}
      showBadge={showBadge}
      badgeLabel={badgeLabel}
      headline={headline}
      description={description}
      showActions={showActions}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    />
  );

  return (
    <article
      className={className}
      style={{
        ...rootStyle,
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: isFlat ? spacing.scale['24'] : spacing.scale['0'],
        padding: spacing.scale['0'],
        overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: isFlat ? border.width['0'] : border.width['1'],
        borderColor: isFlat ? palette.base.transparent : palette.gray['2a'],
        borderRadius: isFlat ? radius.scale['0'] : radius.scale.xxl,
        backgroundColor: isFlat ? palette.base.transparent : palette.base.white,
        boxShadow: shadows.elevation.xs.css,
        ...style,
      }}
      {...props}
    >
      {first === 'image' ? image : content}
      {second === 'content' ? content : image}
    </article>
  );
}
