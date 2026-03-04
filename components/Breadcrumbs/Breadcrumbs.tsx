import React from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import type { BreadcrumbsDivider, BreadcrumbsItem, BreadcrumbsProps, BreadcrumbsSize, BreadcrumbsVisualState } from './Breadcrumbs.types';

type ItemStyleState = {
  textColor: string;
  iconColor: string;
};

const FOLDER_PATH_SM =
  'M1.16667 1.16667V9.33333H10.5V2.33333H5.59183L4.42517 1.16667H1.16667ZM6.07483 1.16667H11.0833C11.238 1.16667 11.3864 1.22812 11.4958 1.33752C11.6052 1.44692 11.6667 1.59529 11.6667 1.75V9.91667C11.6667 10.0714 11.6052 10.2197 11.4958 10.3291C11.3864 10.4385 11.238 10.5 11.0833 10.5H0.583333C0.428624 10.5 0.280251 10.4385 0.170854 10.3291C0.0614581 10.2197 0 10.0714 0 9.91667V0.583333C0 0.428624 0.0614581 0.280251 0.170854 0.170854C0.280251 0.0614581 0.428624 0 0.583333 0H4.90817L6.07483 1.16667Z';

const FOLDER_PATH_MD =
  'M1.33333 1.33333V10.6667H12V2.66667H6.39067L5.05733 1.33333H1.33333ZM6.94267 1.33333H12.6667C12.8435 1.33333 13.013 1.40357 13.1381 1.5286C13.2631 1.65362 13.3333 1.82319 13.3333 2V11.3333C13.3333 11.5101 13.2631 11.6797 13.1381 11.8047C13.013 11.9298 12.8435 12 12.6667 12H0.666667C0.489856 12 0.320286 11.9298 0.195262 11.8047C0.0702379 11.6797 0 11.5101 0 11.3333V0.666667C0 0.489856 0.0702379 0.320286 0.195262 0.195262C0.320286 0.0702379 0.489856 0 0.666667 0H5.60933L6.94267 1.33333Z';

const ARROW_PATH_SM = 'M2.8875 3.71233L0 0.824833L0.824833 0L4.53717 3.71233L0.824833 7.42467L0 6.59983L2.8875 3.71233Z';
const ARROW_PATH_MD = 'M3.3 4.24267L0 0.942667L0.942666 0L5.18533 4.24267L0.942666 8.48533L0 7.54267L3.3 4.24267Z';

const SIZE_CONFIG: Record<
  BreadcrumbsSize,
  {
    rootGap: number;
    itemGap: number;
    stackGap: number;
    iconSize: number;
    dividerWidth: number;
    labelTypography: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: number;
    };
    slashTypography: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: number;
    };
  }
> = {
  sm: {
    rootGap: spacing.scale['8'],
    itemGap: spacing.scale['8'],
    stackGap: spacing.scale['4'],
    iconSize: spacing.scale['14'],
    dividerWidth: spacing.scale['14'],
    labelTypography: typography.scale.captionM.medium,
    slashTypography: typography.scale.captionS.medium,
  },
  md: {
    rootGap: spacing.scale['8'],
    itemGap: spacing.scale['8'],
    stackGap: spacing.scale['6'],
    iconSize: spacing.scale['16'],
    dividerWidth: spacing.scale['16'],
    labelTypography: typography.scale.captionL.medium,
    slashTypography: typography.scale.captionM.medium,
  },
};

function resolveCurrentIndex(items: BreadcrumbsItem[]): number {
  const explicit = items.findIndex((item) => item.current);
  if (explicit >= 0) {
    return explicit;
  }

  return Math.max(items.length - 1, 0);
}

function resolveItemState(
  item: BreadcrumbsItem,
  isCurrent: boolean,
  forceState: BreadcrumbsVisualState | undefined,
): ItemStyleState {
  const secondary = colors.semantic.theme.text.base.staticDarkSecondary;
  const primary = colors.semantic.theme.text.base.staticDark;

  if (forceState === 'disabled' || item.disabled) {
    return {
      textColor: secondary,
      iconColor: secondary,
    };
  }

  if (isCurrent) {
    return {
      textColor: primary,
      iconColor: primary,
    };
  }

  // Hover/focus visuals are not defined in Figma for this component.
  return {
    textColor: secondary,
    iconColor: secondary,
  };
}

function FolderIcon({ size, color }: { size: BreadcrumbsSize; color: string }) {
  const iconSize = size === 'md' ? spacing.scale['16'] : spacing.scale['14'];
  const viewBox = size === 'md' ? '0 0 13.3333 12' : '0 0 11.6667 10.5';
  const path = size === 'md' ? FOLDER_PATH_MD : FOLDER_PATH_SM;

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      style={{
        width: iconSize,
        height: iconSize,
        display: 'block',
        flexShrink: 0,
        color,
      }}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function ArrowDividerIcon({ size }: { size: BreadcrumbsSize }) {
  const iconSize = size === 'md' ? spacing.scale['16'] : spacing.scale['14'];
  const viewBox = size === 'md' ? '0 0 5.18533 8.48533' : '0 0 4.53717 7.42467';
  const path = size === 'md' ? ARROW_PATH_MD : ARROW_PATH_SM;

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      style={{
        width: iconSize,
        height: iconSize,
        display: 'block',
        flexShrink: 0,
        color: colors.semantic.theme.text.base.staticDarkSecondary,
      }}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function BreadcrumbDivider({ divider, size }: { divider: BreadcrumbsDivider; size: BreadcrumbsSize }) {
  const sizeConfig = SIZE_CONFIG[size];

  if (divider === 'slash') {
    return (
      <span
        aria-hidden="true"
        style={{
          width: sizeConfig.dividerWidth,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.semantic.theme.text.base.staticDarkSecondary,
          fontFamily: sizeConfig.slashTypography.fontFamily,
          fontSize: sizeConfig.slashTypography.fontSize,
          fontWeight: sizeConfig.slashTypography.fontWeight,
          lineHeight: `${sizeConfig.slashTypography.lineHeight}px`,
          letterSpacing: `${sizeConfig.slashTypography.letterSpacing}px`,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        /
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        width: sizeConfig.dividerWidth,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ArrowDividerIcon size={size} />
    </span>
  );
}

function BreadcrumbLabel({
  item,
  isCurrent,
  visualState,
  typographyStyle,
}: {
  item: BreadcrumbsItem;
  isCurrent: boolean;
  visualState: ItemStyleState;
  typographyStyle: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
}) {
  const sharedStyle = {
    fontFamily: typographyStyle.fontFamily,
    fontSize: typographyStyle.fontSize,
    fontWeight: typographyStyle.fontWeight,
    lineHeight: `${typographyStyle.lineHeight}px`,
    letterSpacing: `${typographyStyle.letterSpacing}px`,
    color: visualState.textColor,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    textDecoration: 'none',
  };

  if (isCurrent) {
    return (
      <span aria-current="page" style={sharedStyle}>
        {item.label}
      </span>
    );
  }

  if (item.disabled || !item.href) {
    return (
      <span aria-disabled={item.disabled || undefined} style={sharedStyle}>
        {item.label}
      </span>
    );
  }

  return (
    <a href={item.href} style={sharedStyle} {...item.anchorProps}>
      {item.label}
    </a>
  );
}

export function Breadcrumbs({
  items,
  size = 'sm',
  divider = 'icon',
  forceState,
  style,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...props
}: BreadcrumbsProps) {
  const currentIndex = resolveCurrentIndex(items);
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <nav aria-label={ariaLabel} style={style} {...props}>
      <ol
        style={{
          margin: spacing.scale['0'],
          padding: spacing.scale['0'],
          listStyle: 'none',
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: sizeConfig.rootGap,
        }}
      >
        {items.map((item, index) => {
          const isCurrent = index === currentIndex;
          const showDivider = index < items.length - 1;
          const visualState = resolveItemState(item, isCurrent, forceState);

          return (
            <li
              key={item.key ?? `${item.label}-${index}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: sizeConfig.itemGap,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: sizeConfig.stackGap,
                }}
              >
                {item.icon ?? <FolderIcon size={size} color={visualState.iconColor} />}

                <BreadcrumbLabel item={item} isCurrent={isCurrent} visualState={visualState} typographyStyle={sizeConfig.labelTypography} />
              </span>

              {showDivider ? <BreadcrumbDivider divider={divider} size={size} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
