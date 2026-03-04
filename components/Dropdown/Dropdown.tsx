import React, { useId, useMemo, useState } from 'react';

import { border, colors, radius, shadows, spacing, typography } from '../../style-tokens';

import { Checkbox } from '../Checkbox/Checkbox';

import type {
  DropdownItem,
  DropdownItemType,
  DropdownMenuWidth,
  DropdownProps,
  DropdownSelectMode,
  DropdownSize,
  DropdownVariant,
  DropdownVisualState,
} from './Dropdown.types';

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

const CHEVRON_DOWN_ICON_SRC = '/components/Dropdown/assets/chevron-down.svg';
const CHEVRON_UP_ICON_SRC = '/components/Dropdown/assets/chevron-up.svg';
const CHECK_ICON_SRC = '/components/Dropdown/assets/check.svg';
const LEAD_FILE_ICON_SRC = '/components/Dropdown/assets/lead-file.svg';
const LEAD_HASH_ICON_SRC = '/components/Dropdown/assets/lead-hash.svg';
const TAIL_SETTINGS_ICON_SRC = '/components/Dropdown/assets/tail-settings.svg';
const TAIL_ARROW_RIGHT_ICON_SRC = '/components/Dropdown/assets/tail-arrow-right.svg';

const MENU_WIDTH_MAP: Record<DropdownMenuWidth, number> = {
  compact: spacing.scale['160'] + spacing.scale['20'],
  regular: spacing.scale['224'] + spacing.scale['16'],
  wide: spacing.scale['320'],
};

const DEFAULT_ITEMS: DropdownItem[] = [
  { id: 'option-1', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-2', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-3', label: 'Dropdown', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-4', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-5', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-6', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-7', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
  { id: 'option-8', label: 'Option', caption: 'Caption', supportText: '@support', badgeLabel: 'Pro', avatarText: 'B' },
];

function resolveVisualState(
  forcedState: DropdownVisualState | undefined,
  disabled: boolean,
  hovered: boolean,
  focused: boolean,
): DropdownVisualState {
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

function toTypographyStyle(token: {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

function getRowHeight(variant: DropdownVariant): number {
  if (variant === 'extended') {
    return spacing.scale['52'];
  }

  return spacing.scale['36'];
}

function getAvatarSize(variant: DropdownVariant, size: DropdownSize): number {
  if (variant === 'extended' && size === 'lg') {
    return spacing.scale['32'];
  }

  return spacing.scale['20'];
}

function shouldShowLeadingIcon(variant: DropdownVariant, item: DropdownItem): boolean {
  if (typeof item.showLeadingIcon === 'boolean') {
    return item.showLeadingIcon;
  }

  return true;
}

function shouldShowBadge(variant: DropdownVariant, item: DropdownItem): boolean {
  if (typeof item.showBadge === 'boolean') {
    return item.showBadge;
  }

  if (variant === 'select' || variant === 'extended' || variant === 'base') {
    return true;
  }

  return false;
}

function shouldShowToggle(variant: DropdownVariant, item: DropdownItem): boolean {
  if (typeof item.showToggle === 'boolean') {
    return item.showToggle;
  }

  return variant === 'base' || variant === 'extended';
}

function shouldShowTailIcon(variant: DropdownVariant, item: DropdownItem): boolean {
  if (typeof item.showTailIcon === 'boolean') {
    return item.showTailIcon;
  }

  return variant === 'base' || variant === 'extended';
}

function Chevron({ open, disabled }: { open: boolean; disabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: spacing.scale['20'],
        height: spacing.scale['20'],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={open ? CHEVRON_UP_ICON_SRC : CHEVRON_DOWN_ICON_SRC}
        alt=""
        style={{
          width: spacing.scale['10'],
          height: spacing.scale['6'],
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </span>
  );
}

function CheckMark({ disabled }: { disabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: spacing.scale['20'],
        height: spacing.scale['20'],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={CHECK_ICON_SRC}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: disabled ? 0.4 : 1,
        }}
      />
    </span>
  );
}

export function Dropdown({
  id,
  className,
  style,
  label = 'Dropdown',
  variant = 'select',
  state,
  selectMode = 'single',
  itemType = 'default',
  size = 'md',
  width = 'regular',
  position = 'left',
  open,
  defaultOpen = false,
  disabled = false,
  showScrollbar = false,
  items,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  onOpenChange,
  onItemClick,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [triggerFocused, setTriggerFocused] = useState(false);

  const menuId = useId();

  const isOpen = open ?? uncontrolledOpen;
  const selectedIds = controlledSelectedIds ?? uncontrolledSelectedIds;

  const normalizedItems = useMemo(() => {
    if (!items || items.length === 0) {
      return DEFAULT_ITEMS;
    }

    return items;
  }, [items]);

  const menuWidth = MENU_WIDTH_MAP[width];
  const menuRole = variant === 'select' ? 'listbox' : 'menu';
  const optionRole = variant === 'select' ? 'option' : 'menuitem';

  const componentDisabled = disabled || state === 'disabled';

  const setOpenState = (nextOpen: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const setSelectedState = (nextSelected: string[]) => {
    if (controlledSelectedIds === undefined) {
      setUncontrolledSelectedIds(nextSelected);
    }

    onSelectedIdsChange?.(nextSelected);
  };

  const handleTriggerClick = () => {
    if (componentDisabled) {
      return;
    }

    setOpenState(!isOpen);
  };

  const handleItemSelection = (item: DropdownItem, itemDisabled: boolean) => {
    if (itemDisabled) {
      return;
    }

    onItemClick?.(item);

    if (variant !== 'select') {
      return;
    }

    if (selectMode === 'multiple') {
      const nextSelected = selectedIds.includes(item.id)
        ? selectedIds.filter((idValue) => idValue !== item.id)
        : [...selectedIds, item.id];

      setSelectedState(nextSelected);
      return;
    }

    setSelectedState([item.id]);
    setOpenState(false);
  };

  const triggerVisualState = resolveVisualState(state, componentDisabled, false, triggerFocused);
  const triggerDisabled = triggerVisualState === 'disabled';

  return (
    <div
      id={id}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: position === 'right' ? 'flex-end' : 'flex-start',
        gap: spacing.scale['8'],
        ...style,
      }}
    >
      <button
        type="button"
        aria-haspopup={menuRole}
        aria-expanded={isOpen}
        aria-controls={menuId}
        disabled={triggerDisabled}
        onClick={handleTriggerClick}
        onFocus={() => setTriggerFocused(true)}
        onBlur={() => setTriggerFocused(false)}
        style={{
          minHeight: spacing.scale['40'],
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: position === 'right' ? 'flex-end' : 'center',
          gap: spacing.scale['4'],
          paddingInline: spacing.scale['12'],
          paddingBlock: spacing.scale['10'],
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: palette.gray['3'],
          borderRadius: radius.scale.xl,
          backgroundColor: palette.base.white,
          boxShadow: triggerFocused ? shadows.focusRing.light.css : shadows.elevation.xs.css,
          color: textBase.staticDark,
          cursor: triggerDisabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            ...toTypographyStyle(typography.scale.captionL.medium),
            color: triggerDisabled ? textBase.staticDarkQuaternary : textBase.staticDark,
            paddingInline: spacing.scale['4'],
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: spacing.scale['20'],
            height: spacing.scale['20'],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Chevron open={isOpen} disabled={triggerDisabled} />
        </span>
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role={menuRole}
          aria-multiselectable={variant === 'select' && selectMode === 'multiple' ? true : undefined}
          style={{
            position: 'absolute',
            top: spacing.scale['40'] + spacing.scale['8'],
            [position === 'right' ? 'right' : 'left']: spacing.scale['0'],
            width: menuWidth,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: spacing.scale['0'],
            paddingBlock: spacing.scale['4'],
            paddingInline: spacing.scale['0'],
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.base.white,
            boxShadow: shadows.elevation.lg.css,
            boxSizing: 'border-box',
            zIndex: spacing.scale['20'],
          }}
        >
          {normalizedItems.map((item) => {
            const itemHovered = hoveredItemId === item.id;
            const itemFocused = focusedItemId === item.id;
            const forcedState = item.state ?? state;
            const itemDisabled = componentDisabled || item.disabled === true;
            const visualState = resolveVisualState(forcedState, itemDisabled, itemHovered, itemFocused);
            const isDisabled = visualState === 'disabled';
            const isSelected = selectedIds.includes(item.id);

            const showLeadingIcon = shouldShowLeadingIcon(variant, item);
            const showBadge = shouldShowBadge(variant, item);
            const showToggle = shouldShowToggle(variant, item);
            const showTailIcon = shouldShowTailIcon(variant, item);

            const rowHeight = getRowHeight(variant);
            const avatarSize = getAvatarSize(variant, size);

            const labelColor = isDisabled ? textBase.staticDarkQuaternary : textBase.staticDark;
            const subTextColor = isDisabled ? textBase.staticDarkQuaternary : textBase.staticDarkTertiary;

            const overlayBackground = (() => {
              if (isSelected && variant === 'select') {
                if (visualState === 'hover') {
                  return palette.gray['2a'];
                }

                return palette.gray['1a'];
              }

              if (visualState === 'hover') {
                return palette.gray['1a'];
              }

              return palette.base.transparent;
            })();

            const wrapBorderColor = visualState === 'focus' ? palette.purple['6'] : palette.base.transparent;
            const wrapBoxShadow = visualState === 'focus' ? shadows.focusRing.light.css : 'none';

            const labelTypography = typography.scale.captionL.regular;
            const supportTypography = typography.scale.captionM.regular;
            const avatarTypography = avatarSize === spacing.scale['32'] ? typography.scale.captionL.medium : typography.scale.captionM.medium;

            const leadIconElement = (() => {
              if (!showLeadingIcon) {
                return null;
              }

              if (item.leadingIcon) {
                return item.leadingIcon;
              }

              if (itemType === 'avatar') {
                return (
                  <span
                    aria-hidden="true"
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: radius.scale.full,
                      backgroundColor: palette.green['8'],
                      opacity: isDisabled ? 0.5 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: textBase.staticWhite,
                      ...toTypographyStyle(avatarTypography),
                    }}
                  >
                    {item.avatarText ?? 'B'}
                  </span>
                );
              }

              if (variant === 'extended' && size === 'lg') {
                return (
                  <span
                    aria-hidden="true"
                    style={{
                      width: spacing.scale['32'],
                      height: spacing.scale['32'],
                      borderRadius: radius.scale.full,
                      backgroundColor: palette.blue['1'],
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: spacing.scale['16'],
                        height: spacing.scale['16'],
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={LEAD_FILE_ICON_SRC}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          userSelect: 'none',
                          pointerEvents: 'none',
                          opacity: isDisabled ? 0.4 : 1,
                        }}
                      />
                    </span>
                  </span>
                );
              }

              const leadIconSrc = variant === 'select' ? LEAD_HASH_ICON_SRC : LEAD_FILE_ICON_SRC;

              return (
                <span
                  aria-hidden="true"
                  style={{
                    width: spacing.scale['20'],
                    height: spacing.scale['20'],
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={leadIconSrc}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  />
                </span>
              );
            })();

            const tailElement = (() => {
              if (variant === 'select' && selectMode === 'single' && isSelected) {
                return (
                  <span
                    aria-hidden="true"
                    style={{
                      width: spacing.scale['20'],
                      height: spacing.scale['20'],
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckMark disabled={isDisabled} />
                  </span>
                );
              }

              if (!showTailIcon) {
                return null;
              }

              if (item.tailIcon) {
                return item.tailIcon;
              }

              return (
                <span
                  aria-hidden="true"
                  style={{
                    width: variant === 'base' ? spacing.scale['16'] : spacing.scale['20'],
                    height: variant === 'base' ? spacing.scale['16'] : spacing.scale['20'],
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={variant === 'base' ? TAIL_ARROW_RIGHT_ICON_SRC : TAIL_SETTINGS_ICON_SRC}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      opacity: isDisabled ? 0.4 : 1,
                    }}
                  />
                </span>
              );
            })();

            const badgeElement = showBadge ? (
              <span
                aria-hidden="true"
                style={{
                  padding: spacing.scale['2'],
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingInline: spacing.scale['2'],
                    paddingBlock: spacing.scale['0'],
                    borderStyle: 'solid',
                    borderWidth: border.width['1'],
                    borderColor: palette.gray['2a'],
                    borderRadius: radius.scale.xs,
                    backgroundColor: variant === 'select' ? palette.blue['2'] : palette.base.white,
                  }}
                >
                  <span
                    style={{
                      ...toTypographyStyle(typography.scale.captionM.medium),
                      color: variant === 'select' ? palette.blue['11'] : textBase.staticDarkSecondary,
                      paddingInline: spacing.scale['2'],
                    }}
                  >
                    {item.badgeLabel ?? 'Pro'}
                  </span>
                </span>
              </span>
            ) : null;

            const toggleElement = showToggle ? (
              <span
                aria-hidden="true"
                style={{
                  padding: spacing.scale['2'],
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    width: spacing.scale['28'],
                    height: spacing.scale['16'],
                    borderRadius: radius.scale.full,
                    paddingInline: spacing.scale['2'],
                    paddingBlock: spacing.scale['2'],
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: item.toggleActive ? 'flex-end' : 'flex-start',
                    backgroundColor: isDisabled
                      ? palette.gray['2']
                      : item.toggleActive
                        ? palette.green[visualState === 'hover' ? '9' : '8']
                        : palette.gray['5'],
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      width: spacing.scale['12'],
                      height: spacing.scale['12'],
                      borderRadius: radius.scale.full,
                      backgroundColor: isDisabled ? palette.gray['4'] : palette.base.white,
                      boxShadow: isDisabled ? 'none' : shadows.elevation.xs['0'].css,
                    }}
                  />
                </span>
              </span>
            ) : null;

            const multipleSelectPrefix = variant === 'select' && selectMode === 'multiple' ? (
              <span
                aria-hidden="true"
                style={{
                  padding: spacing.scale['2'],
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Checkbox
                  size="sm"
                  type="default"
                  checked={isSelected}
                  state={isDisabled ? 'disabled' : visualState}
                  disabled={isDisabled}
                  ariaLabel={`${item.label} selection`}
                />
              </span>
            ) : null;

            return (
              <button
                key={item.id}
                type="button"
                role={optionRole}
                aria-selected={variant === 'select' ? isSelected : undefined}
                disabled={isDisabled}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId((prev) => (prev === item.id ? null : prev))}
                onFocus={() => setFocusedItemId(item.id)}
                onBlur={() => setFocusedItemId((prev) => (prev === item.id ? null : prev))}
                onClick={() => handleItemSelection(item, isDisabled)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleItemSelection(item, isDisabled);
                  }
                }}
                style={{
                  width: '100%',
                  minHeight: rowHeight,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale['4'],
                  paddingInline: spacing.scale['6'],
                  paddingBlock: spacing.scale['2'],
                  borderStyle: 'solid',
                  borderWidth: border.width['0'],
                  borderColor: palette.base.transparent,
                  backgroundColor: palette.base.transparent,
                  textAlign: 'left',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <span
                  style={{
                    width: '100%',
                    minHeight: variant === 'extended' ? spacing.scale['48'] : spacing.scale['32'],
                    display: 'flex',
                    alignItems: variant === 'extended' ? 'flex-start' : 'center',
                    gap: spacing.scale['4'],
                    padding: spacing.scale['6'],
                    borderRadius: radius.scale.sm,
                    borderStyle: 'solid',
                    borderWidth: visualState === 'focus' ? border.width['1'] : border.width['0'],
                    borderColor: wrapBorderColor,
                    backgroundColor: overlayBackground,
                    boxShadow: wrapBoxShadow,
                    boxSizing: 'border-box',
                  }}
                >
                  {multipleSelectPrefix}
                  {leadIconElement}

                  <span
                    style={{
                      flex: 1,
                      minWidth: spacing.scale['0'],
                      display: 'flex',
                      flexDirection: variant === 'extended' ? 'column' : 'row',
                      alignItems: variant === 'extended' ? 'flex-start' : 'center',
                      gap: spacing.scale['4'],
                      paddingInline: spacing.scale['4'],
                      paddingBlock: spacing.scale['0'],
                    }}
                  >
                    <span
                      style={{
                        ...toTypographyStyle(labelTypography),
                        color: labelColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </span>

                    {variant === 'extended' && item.caption ? (
                      <span
                        style={{
                          ...toTypographyStyle(supportTypography),
                          color: subTextColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.caption}
                      </span>
                    ) : null}

                    {variant === 'select' && item.supportText ? (
                      <span
                        style={{
                          ...toTypographyStyle(supportTypography),
                          color: subTextColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.supportText}
                      </span>
                    ) : null}

                    {variant === 'base' && item.caption ? (
                      <span
                        style={{
                          ...toTypographyStyle(supportTypography),
                          color: subTextColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.caption}
                      </span>
                    ) : null}

                    {badgeElement}
                  </span>

                  {toggleElement}
                  {tailElement}
                </span>
              </button>
            );
          })}

          {showScrollbar ? (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: -border.width['1'],
                top: -border.width['1'],
                bottom: -border.width['1'],
                width: spacing.scale['16'],
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: spacing.scale['6'],
                  width: spacing.scale['4'],
                  height: spacing.scale['112'],
                  borderRadius: radius.scale.full,
                  backgroundColor: palette.gray['2'],
                  transform: 'translateX(-50%)',
                }}
              />
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
