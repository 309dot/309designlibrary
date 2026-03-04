import React, { useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { TaskCardProps, TaskCardState } from './TaskCard.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;

function getTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function resolveState(forcedState: TaskCardState | undefined, hovered: boolean, interactive: boolean): TaskCardState {
  if (forcedState) {
    return forcedState;
  }

  if (interactive && hovered) {
    return 'hover';
  }

  return 'default';
}

function Badge({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingInline: spacing.scale['4'],
        paddingBlock: spacing.scale['2'],
        borderRadius: radius.scale.md,
        backgroundColor: palette.gray['2'],
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: spacing.scale['4'],
          paddingBlock: spacing.scale['0'],
          color: textTokens.staticDarkSecondary,
          ...getTypographyStyle(typography.scale.captionL.medium),
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function TaskCard({
  state,
  interactive = true,
  headline = 'Create a new job post',
  description = 'Design better and spend less time without restricting creative freedom.',
  caption = 'CFW-481',
  tags = ['Design', 'Hiring'],
  onClick,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  ...props
}: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  const resolvedState = resolveState(state, hovered, interactive);
  const isInteractive = Boolean(onClick) || interactive;

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    if (!onClick) {
      onKeyDown?.(event);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }

    onKeyDown?.(event);
  };

  return (
    <article
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
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
        width: spacing.scale['400'],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing.scale['12'],
        padding: spacing.scale['16'],
        borderStyle: 'solid',
        borderWidth: border.width['1'],
        borderColor: palette.gray['3'],
        borderRadius: radius.scale.lg,
        backgroundColor: resolvedState === 'hover' ? palette.gray['1'] : palette.base.white,
        boxShadow: shadows.elevation.xs.css,
        boxSizing: 'border-box',
        cursor: isInteractive ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: spacing.scale['4'],
        }}
      >
        <h3
          style={{
            margin: spacing.scale['0'],
            width: '100%',
            color: textTokens.staticDark,
            ...getTypographyStyle(typography.scale.bodyS.medium),
          }}
        >
          {headline}
        </h3>

        <p
          style={{
            margin: spacing.scale['0'],
            width: '100%',
            color: textTokens.staticDarkSecondary,
            ...getTypographyStyle(typography.scale.captionL.regular),
          }}
        >
          {description}
        </p>

        <p
          style={{
            margin: spacing.scale['0'],
            width: '100%',
            color: textTokens.staticDarkTertiary,
            ...getTypographyStyle(typography.scale.captionM.medium),
          }}
        >
          {caption}
        </p>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: spacing.scale['8'],
        }}
      >
        {tags.map((tag) => (
          <Badge key={tag} label={tag} />
        ))}
      </div>
    </article>
  );
}
