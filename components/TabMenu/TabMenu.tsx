import React, { useEffect, useMemo, useRef, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import type { TabMenuItem, TabMenuProps, TabMenuSize, TabMenuType, TabMenuVisualState } from './TabMenu.types';

type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

type SizeConfig = {
  fillPaddingX: number;
  fillPaddingY: number;
  fillRadius: number;
  fillTypography: TypographyToken;
  linePaddingTop: number;
  linePaddingBottom: number;
  lineTypography: TypographyToken;
  segmentedRootRadius: number;
  segmentedItemRadius: number;
  segmentedPaddingX: number;
  segmentedPaddingY: number;
  segmentedTypography: TypographyToken;
  badgePaddingX: number;
  badgePaddingY: number;
  badgeRadius: number;
  badgeTypography: TypographyToken;
  labelWrapPaddingX: number;
};

const SIZE_CONFIG: Record<TabMenuSize, SizeConfig> = {
  lg: {
    fillPaddingX: spacing.scale['16'],
    fillPaddingY: spacing.scale['12'],
    fillRadius: radius.scale.xl,
    fillTypography: typography.scale.bodyS.medium,
    linePaddingTop: spacing.scale['10'],
    linePaddingBottom: spacing.scale['14'],
    lineTypography: typography.scale.bodyS.medium,
    segmentedRootRadius: radius.scale.xl,
    segmentedItemRadius: radius.scale.lg,
    segmentedPaddingX: spacing.scale['12'],
    segmentedPaddingY: spacing.scale['10'],
    segmentedTypography: typography.scale.bodyS.medium,
    badgePaddingX: spacing.scale['8'],
    badgePaddingY: spacing.scale['2'],
    badgeRadius: radius.scale.md,
    badgeTypography: typography.scale.captionL.medium,
    labelWrapPaddingX: spacing.scale['4'],
  },
  md: {
    fillPaddingX: spacing.scale['12'],
    fillPaddingY: spacing.scale['8'],
    fillRadius: radius.scale.xl,
    fillTypography: typography.scale.bodyS.medium,
    linePaddingTop: spacing.scale['6'],
    linePaddingBottom: spacing.scale['10'],
    lineTypography: typography.scale.bodyS.medium,
    segmentedRootRadius: radius.scale.xl,
    segmentedItemRadius: radius.scale.lg,
    segmentedPaddingX: spacing.scale['10'],
    segmentedPaddingY: spacing.scale['6'],
    segmentedTypography: typography.scale.bodyS.medium,
    badgePaddingX: spacing.scale['8'],
    badgePaddingY: spacing.scale['2'],
    badgeRadius: radius.scale.md,
    badgeTypography: typography.scale.captionL.medium,
    labelWrapPaddingX: spacing.scale['4'],
  },
  sm: {
    fillPaddingX: spacing.scale['12'],
    fillPaddingY: spacing.scale['6'],
    fillRadius: radius.scale.lg,
    fillTypography: typography.scale.captionL.medium,
    linePaddingTop: spacing.primitive['5'],
    linePaddingBottom: spacing.primitive['7'],
    lineTypography: typography.scale.captionL.medium,
    segmentedRootRadius: radius.scale.lg,
    segmentedItemRadius: radius.scale.md,
    segmentedPaddingX: spacing.scale['8'],
    segmentedPaddingY: spacing.scale['4'],
    segmentedTypography: typography.scale.captionL.medium,
    badgePaddingX: spacing.scale['6'],
    badgePaddingY: spacing.scale['2'],
    badgeRadius: radius.scale.sm,
    badgeTypography: typography.scale.captionM.medium,
    labelWrapPaddingX: spacing.scale['4'],
  },
};

const ITEM_GAP_BY_TYPE: Record<TabMenuType, number> = {
  fill: spacing.scale['8'],
  line: spacing.scale['24'],
  segmented: spacing.scale['2'],
};

const DEFAULT_ITEMS: TabMenuItem[] = [
  { id: 'tab-01', label: 'Label' },
  { id: 'tab-02', label: 'Label', badge: '12' },
  { id: 'tab-03', label: 'Label' },
  { id: 'tab-04', label: 'Label', badge: '08' },
  { id: 'tab-05', label: 'Label' },
  { id: 'tab-06', label: 'Label' },
  { id: 'tab-07', label: 'Label' },
  { id: 'tab-08', label: 'Label' },
  { id: 'tab-09', label: 'Label' },
  { id: 'tab-10', label: 'Label' },
];

const SEGMENTED_DEFAULT_ITEMS: TabMenuItem[] = DEFAULT_ITEMS.slice(0, 5);

const textBase = colors.semantic.theme.text.base;
const backgroundButton = colors.semantic.theme.background.button;
const overlayBackground = colors.semantic.theme.background.overlay;

function toTypographyStyle(token: TypographyToken) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function getDefaultItems(type: TabMenuType): TabMenuItem[] {
  return type === 'segmented' ? SEGMENTED_DEFAULT_ITEMS : DEFAULT_ITEMS;
}

function findInitialSelectedId(items: TabMenuItem[], preferredId?: string): string {
  if (preferredId) {
    const preferredItem = items.find((item) => item.id === preferredId && !item.disabled);

    if (preferredItem) {
      return preferredItem.id;
    }
  }

  const second = items[1];
  if (second && !second.disabled) {
    return second.id;
  }

  const firstEnabled = items.find((item) => !item.disabled);

  if (firstEnabled) {
    return firstEnabled.id;
  }

  return items[0]?.id ?? '';
}

function resolveItemState(item: TabMenuItem, globalDisabled: boolean, forceState: TabMenuVisualState | undefined): TabMenuVisualState {
  if (globalDisabled || item.disabled || item.state === 'disabled' || forceState === 'disabled') {
    return 'disabled';
  }

  if (item.state && item.state !== 'default') {
    return item.state;
  }

  if (forceState && forceState !== 'default') {
    return forceState;
  }

  return 'default';
}

function getTextColor(selected: boolean): string {
  return selected ? textBase.staticDark : textBase.staticDarkSecondary;
}

function getTypographyToken(type: TabMenuType, config: SizeConfig): TypographyToken {
  if (type === 'line') {
    return config.lineTypography;
  }

  if (type === 'segmented') {
    return config.segmentedTypography;
  }

  return config.fillTypography;
}

export function TabMenu({
  type = 'fill',
  size = 'md',
  items,
  selectedId,
  defaultSelectedId,
  forceItemState,
  disabled = false,
  onSelectedIdChange,
  className,
  style,
  ...rest
}: TabMenuProps) {
  const config = SIZE_CONFIG[size];
  const resolvedItems = useMemo(() => items ?? getDefaultItems(type), [items, type]);

  const fallbackSelectedId = useMemo(
    () => findInitialSelectedId(resolvedItems, defaultSelectedId),
    [resolvedItems, defaultSelectedId],
  );

  const isControlled = selectedId !== undefined;
  const [internalSelectedId, setInternalSelectedId] = useState<string>(fallbackSelectedId);

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setInternalSelectedId((previous) => {
      const stillExists = resolvedItems.some((item) => item.id === previous && !item.disabled);
      return stillExists ? previous : fallbackSelectedId;
    });
  }, [fallbackSelectedId, isControlled, resolvedItems]);

  const currentSelectedId = isControlled ? selectedId : internalSelectedId;
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const rootStyle =
    type === 'segmented'
      ? {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: ITEM_GAP_BY_TYPE.segmented,
          padding: spacing.scale['2'],
          borderRadius: config.segmentedRootRadius,
          backgroundColor: overlayBackground.custom,
        }
      : {
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: ITEM_GAP_BY_TYPE[type],
          padding: spacing.scale['0'],
        };

  const handleSelection = (item: TabMenuItem, itemState: TabMenuVisualState) => {
    if (itemState === 'disabled') {
      return;
    }

    if (!isControlled) {
      setInternalSelectedId(item.id);
    }

    onSelectedIdChange?.(item.id);
  };

  const moveByKeyboard = (currentIndex: number, direction: 1 | -1) => {
    const enabledIndices = resolvedItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => resolveItemState(item, disabled, forceItemState) !== 'disabled')
      .map(({ index }) => index);

    if (enabledIndices.length === 0) {
      return;
    }

    const currentEnabledIndex = enabledIndices.indexOf(currentIndex);
    const safeIndex = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
    const nextEnabledIndex = (safeIndex + direction + enabledIndices.length) % enabledIndices.length;
    const targetIndex = enabledIndices[nextEnabledIndex];
    const targetItem = resolvedItems[targetIndex];

    if (!targetItem) {
      return;
    }

    handleSelection(targetItem, 'default');
    itemRefs.current[targetIndex]?.focus();
  };

  const moveToEdgeByKeyboard = (edge: 'first' | 'last') => {
    const enabledItems = resolvedItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => resolveItemState(item, disabled, forceItemState) !== 'disabled');

    if (enabledItems.length === 0) {
      return;
    }

    const target = edge === 'first' ? enabledItems[0] : enabledItems[enabledItems.length - 1];
    handleSelection(target.item, 'default');
    itemRefs.current[target.index]?.focus();
  };

  return (
    <div
      {...rest}
      className={className}
      role="tablist"
      aria-orientation="horizontal"
      aria-disabled={disabled || undefined}
      style={{
        ...rootStyle,
        ...style,
      }}
    >
      {resolvedItems.map((item, index) => {
        const itemState = resolveItemState(item, disabled, forceItemState);
        const isItemDisabled = itemState === 'disabled';
        const isSelected = !isItemDisabled && item.id === currentSelectedId;
        const labelColor = getTextColor(isSelected);
        const showBadge = typeof item.badge === 'string' && item.badge.trim().length > 0;
        const textTypography = getTypographyToken(type, config);

        const buttonStyle =
          type === 'fill'
            ? {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.scale['0'],
                paddingInline: config.fillPaddingX,
                paddingBlock: config.fillPaddingY,
                borderRadius: config.fillRadius,
                borderStyle: 'solid',
                borderWidth: border.width['0'],
                borderColor: colors.primitive.palette.base.transparent,
                backgroundColor: isSelected ? backgroundButton.tertiary : colors.primitive.palette.base.transparent,
                boxShadow: 'none',
              }
            : type === 'line'
              ? {
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.scale['8'],
                  paddingInline: spacing.scale['0'],
                  paddingTop: config.linePaddingTop,
                  paddingBottom: config.linePaddingBottom,
                  borderStyle: 'solid',
                  borderWidth: border.width['0'],
                  borderBottomStyle: 'solid',
                  borderBottomWidth: isSelected ? border.width['2'] : border.width['0'],
                  borderBottomColor: isSelected ? border.color.theme.select.primary : colors.primitive.palette.base.transparent,
                  borderRadius: spacing.scale['0'],
                  backgroundColor: colors.primitive.palette.base.transparent,
                  boxShadow: 'none',
                }
              : {
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.scale['0'],
                  flex: '1 0 0',
                  minWidth: spacing.scale['0'],
                  paddingInline: config.segmentedPaddingX,
                  paddingBlock: config.segmentedPaddingY,
                  borderRadius: config.segmentedItemRadius,
                  borderStyle: 'solid',
                  borderWidth: isSelected ? border.width['1'] : border.width['0'],
                  borderColor: isSelected ? border.color.theme.action.normal : colors.primitive.palette.base.transparent,
                  backgroundColor: isSelected ? backgroundButton.secondary : colors.primitive.palette.base.transparent,
                  boxShadow: isSelected ? shadows.elevation.xs.css : 'none',
                };

        const textWrapStyle =
          type === 'line'
            ? {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: spacing.scale['0'],
                paddingBlock: spacing.scale['0'],
              }
            : {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingInline: config.labelWrapPaddingX,
                paddingBlock: spacing.scale['0'],
              };

        return (
          <button
            key={item.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-disabled={isItemDisabled || undefined}
            tabIndex={isSelected ? 0 : -1}
            disabled={isItemDisabled}
            onClick={() => handleSelection(item, itemState)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveByKeyboard(index, 1);
                return;
              }

              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                moveByKeyboard(index, -1);
                return;
              }

              if (event.key === 'Home') {
                event.preventDefault();
                moveToEdgeByKeyboard('first');
                return;
              }

              if (event.key === 'End') {
                event.preventDefault();
                moveToEdgeByKeyboard('last');
              }
            }}
            style={{
              ...buttonStyle,
              cursor: isItemDisabled ? 'default' : 'pointer',
            }}
          >
            <span style={textWrapStyle}>
              <span
                style={{
                  ...toTypographyStyle(textTypography),
                  color: labelColor,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            </span>

            {showBadge && (
              <span
                style={
                  type === 'line'
                    ? {
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingInline: spacing.scale['0'],
                        paddingBlock: spacing.scale['0'],
                      }
                    : {
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingInline: config.labelWrapPaddingX,
                        paddingBlock: spacing.scale['0'],
                      }
                }
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingInline: config.badgePaddingX,
                    paddingBlock: config.badgePaddingY,
                    borderRadius: config.badgeRadius,
                    backgroundColor: backgroundButton.tertiary,
                  }}
                >
                  <span
                    style={{
                      ...toTypographyStyle(config.badgeTypography),
                      color: labelColor,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.badge}
                  </span>
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TabMenu;
