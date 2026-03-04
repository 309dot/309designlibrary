import React, { useMemo, useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { ButtonGroup } from './ButtonGroup';
import type {
  ButtonGroupItemData,
  ButtonGroupItemState,
  ButtonGroupItemType,
  ButtonGroupShape,
  ButtonGroupSize,
} from './ButtonGroup.types';

const SIZES: ButtonGroupSize[] = ['lg', 'md', 'sm'];
const SHAPES: ButtonGroupShape[] = ['rounded', 'pill'];
const TYPES: ButtonGroupItemType[] = ['default', 'iconOnly'];
const STATES: Array<'default' | ButtonGroupItemState> = ['default', 'hover', 'focus', 'active', 'disabled'];

function toTitle(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function createPreviewItems(type: ButtonGroupItemType, disabled: boolean, activeIndex: number, showBadge: boolean, showLeadingIcon: boolean, showTrailingIcon: boolean): ButtonGroupItemData[] {
  return Array.from({ length: 3 }, (_, index) => ({
    key: `item-${index}`,
    type,
    label: 'Button',
    badgeLabel: '16',
    showBadge,
    showLeadingIcon,
    showTrailingIcon,
    disabled,
    active: index === activeIndex,
  }));
}

export default function ButtonGroupPreviewPage() {
  const [size, setSize] = useState<ButtonGroupSize>('lg');
  const [shape, setShape] = useState<ButtonGroupShape>('rounded');
  const [type, setType] = useState<ButtonGroupItemType>('default');
  const [state, setState] = useState<'default' | ButtonGroupItemState>('default');
  const [disabled, setDisabled] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showLeadingIcon, setShowLeadingIcon] = useState(true);
  const [showTrailingIcon, setShowTrailingIcon] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  const forceState = useMemo(() => (state === 'default' ? undefined : state), [state]);
  const previewItems = useMemo(
    () => createPreviewItems(type, disabled, activeIndex, showBadge, showLeadingIcon, showTrailingIcon),
    [type, disabled, activeIndex, showBadge, showLeadingIcon, showTrailingIcon],
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: colors.primitive.palette.base.white,
        color: colors.semantic.theme.text.base.staticDark,
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
              margin: 0,
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Button Group Preview
          </h1>
          <p
            style={{
              margin: 0,
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma MCP variant(`size`, `shape`, `type`, `state`, `align`) 대응 인터랙션 검증
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as ButtonGroupSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
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
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>Shape</span>
            <select
              value={shape}
              onChange={(event) => setShape(event.target.value as ButtonGroupShape)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {SHAPES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as ButtonGroupItemType)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as 'default' | ButtonGroupItemState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
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
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>Active Index</span>
            <select
              value={activeIndex}
              onChange={(event) => setActiveIndex(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {[0, 1, 2].map((item) => (
                <option key={item} value={item}>
                  Item {item + 1}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Disabled</span>
            <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Badge</span>
            <input
              type="checkbox"
              checked={showBadge}
              disabled={type === 'iconOnly'}
              onChange={(event) => setShowBadge(event.target.checked)}
            />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Leading Icon</span>
            <input
              type="checkbox"
              checked={showLeadingIcon}
              disabled={type === 'iconOnly'}
              onChange={(event) => setShowLeadingIcon(event.target.checked)}
            />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Trailing Icon</span>
            <input
              type="checkbox"
              checked={showTrailingIcon}
              disabled={type === 'iconOnly'}
              onChange={(event) => setShowTrailingIcon(event.target.checked)}
            />
          </label>
        </div>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.primitive.palette.gray['1'],
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Active Selection
          </h2>

          <ButtonGroup size={size} shape={shape} items={previewItems} forceState={forceState} />
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.primitive.palette.gray['1'],
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Variant Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['16'] }}>
            {SHAPES.map((shapeItem) => (
              <div key={shapeItem} style={{ display: 'grid', gap: spacing.scale['8'] }}>
                <span
                  style={{
                    color: colors.semantic.theme.text.base.staticDarkSecondary,
                    fontSize: typography.scale.captionM.medium.fontSize,
                    fontWeight: typography.scale.captionM.medium.fontWeight,
                    lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                  }}
                >
                  Shape {toTitle(shapeItem)}
                </span>

                {SIZES.map((sizeItem) => (
                  <ButtonGroup
                    key={`${shapeItem}-${sizeItem}`}
                    size={sizeItem}
                    shape={shapeItem}
                    items={createPreviewItems(type, false, 1, type === 'default', type === 'default', type === 'default')}
                    forceState="default"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

