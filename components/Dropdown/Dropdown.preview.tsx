import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Dropdown } from './Dropdown';
import type {
  DropdownItem,
  DropdownItemType,
  DropdownMenuWidth,
  DropdownPosition,
  DropdownSelectMode,
  DropdownSize,
  DropdownVariant,
  DropdownVisualState,
} from './Dropdown.types';

const VARIANTS: DropdownVariant[] = ['base', 'select', 'extended'];
const STATES: Array<'auto' | DropdownVisualState> = ['auto', 'default', 'hover', 'focus', 'disabled'];
const SELECT_MODES: DropdownSelectMode[] = ['single', 'multiple'];
const ITEM_TYPES: DropdownItemType[] = ['default', 'avatar'];
const SIZES: DropdownSize[] = ['md', 'lg'];
const WIDTHS: DropdownMenuWidth[] = ['compact', 'regular', 'wide'];
const POSITIONS: DropdownPosition[] = ['left', 'right'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createItems(variant: DropdownVariant): DropdownItem[] {
  const baseItems: DropdownItem[] = [
    { id: 'option-1', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-2', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-3', label: 'Dropdown', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-4', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-5', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-6', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-7', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
    { id: 'option-8', label: 'Option', supportText: '@support', caption: 'Caption', badgeLabel: 'Pro', avatarText: 'B' },
  ];

  if (variant === 'base') {
    return baseItems.map((item) => ({
      ...item,
      supportText: undefined,
      caption: undefined,
      showToggle: true,
      showTailIcon: true,
    }));
  }

  if (variant === 'select') {
    return baseItems.map((item) => ({
      ...item,
      caption: undefined,
      showToggle: false,
      showTailIcon: false,
    }));
  }

  return baseItems.map((item) => ({
    ...item,
    caption: 'Caption',
    supportText: undefined,
    showToggle: true,
    showTailIcon: true,
  }));
}

export default function DropdownPreviewPage() {
  const [variant, setVariant] = useState<DropdownVariant>('select');
  const [state, setState] = useState<'auto' | DropdownVisualState>('auto');
  const [selectMode, setSelectMode] = useState<DropdownSelectMode>('single');
  const [itemType, setItemType] = useState<DropdownItemType>('default');
  const [size, setSize] = useState<DropdownSize>('md');
  const [width, setWidth] = useState<DropdownMenuWidth>('regular');
  const [position, setPosition] = useState<DropdownPosition>('left');
  const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(['option-3']);

  const items = useMemo(() => createItems(variant), [variant]);

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
        backgroundColor: palette.base.white,
        color: textBase.staticDark,
        padding: spacing.scale['24'],
        fontFamily: typography.scale.bodyM.medium.fontFamily,
      }}
    >
      <section
        style={{
          maxWidth: spacing.scale['1024'],
          marginInline: 'auto',
          display: 'grid',
          gap: spacing.scale['24'],
        }}
      >
        <header style={{ display: 'grid', gap: spacing.scale['8'] }}>
          <h1
            style={{
              margin: spacing.scale['0'],
              ...(() => {
                const token = typography.scale.h3.bold;
                return {
                  fontFamily: token.fontFamily,
                  fontSize: token.fontSize,
                  fontWeight: token.fontWeight,
                  lineHeight: `${token.lineHeight}px`,
                  letterSpacing: `${token.letterSpacing}px`,
                };
              })(),
            }}
          >
            Dropdown Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textBase.staticDarkSecondary,
              ...(() => {
                const token = typography.scale.bodyS.regular;
                return {
                  fontFamily: token.fontFamily,
                  fontSize: token.fontSize,
                  fontWeight: token.fontWeight,
                  lineHeight: `${token.lineHeight}px`,
                  letterSpacing: `${token.letterSpacing}px`,
                };
              })(),
            }}
          >
            Figma variant(Base/Select/Extended + State + Select mode + Type + Size + Position) 검증
          </p>
        </header>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.gray['1'],
            padding: spacing.scale['16'],
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Variant</span>
            <select
              value={variant}
              onChange={(event) => setVariant(event.target.value as DropdownVariant)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {VARIANTS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as 'auto' | DropdownVisualState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {STATES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Select Mode</span>
            <select
              value={selectMode}
              onChange={(event) => setSelectMode(event.target.value as DropdownSelectMode)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {SELECT_MODES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Item Type</span>
            <select
              value={itemType}
              onChange={(event) => setItemType(event.target.value as DropdownItemType)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {ITEM_TYPES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as DropdownSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {SIZES.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Width</span>
            <select
              value={width}
              onChange={(event) => setWidth(event.target.value as DropdownMenuWidth)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {WIDTHS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Position</span>
            <select
              value={position}
              onChange={(event) => setPosition(event.target.value as DropdownPosition)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textBase.staticDark,
              }}
            >
              {POSITIONS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Open</span>
            <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Disabled</span>
            <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: palette.base.white,
            }}
          >
            <span>Scrollbar</span>
            <input
              type="checkbox"
              checked={showScrollbar}
              onChange={(event) => setShowScrollbar(event.target.checked)}
            />
          </label>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: palette.gray['1'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            minHeight: spacing.scale['400'],
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              ...(() => {
                const token = typography.scale.h5.semiBold;
                return {
                  fontFamily: token.fontFamily,
                  fontSize: token.fontSize,
                  fontWeight: token.fontWeight,
                  lineHeight: `${token.lineHeight}px`,
                  letterSpacing: `${token.letterSpacing}px`,
                };
              })(),
            }}
          >
            Active Selection
          </h2>

          <Dropdown
            variant={variant}
            state={state === 'auto' ? undefined : state}
            selectMode={selectMode}
            itemType={itemType}
            size={size}
            width={width}
            position={position}
            open={open}
            disabled={disabled}
            showScrollbar={showScrollbar}
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
            onOpenChange={setOpen}
            items={items}
          />
        </section>
      </section>
    </main>
  );
}
