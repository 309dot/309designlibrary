import React, { useMemo, useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { Badge } from './Badge';
import type { BadgeColor, BadgeShape, BadgeSize, BadgeVisualState } from './Badge.types';

const COLORS: BadgeColor[] = [
  'gray',
  'blue',
  'green',
  'orange',
  'red',
  'purple',
  'white',
  'whiteDestructive',
  'surface',
  'surfaceDestructive',
];

const SIZES: BadgeSize[] = ['xs', 'sm', 'md', 'lg'];
const SHAPES: BadgeShape[] = ['rounded', 'pill'];
const STATE_OPTIONS: BadgeVisualState[] = ['default', 'hover', 'focus', 'disabled'];

function toTitle(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export default function BadgePreviewPage() {
  const [color, setColor] = useState<BadgeColor>('gray');
  const [size, setSize] = useState<BadgeSize>('md');
  const [shape, setShape] = useState<BadgeShape>('rounded');
  const [state, setState] = useState<BadgeVisualState>('default');
  const [stroke, setStroke] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showLeadingIcon, setShowLeadingIcon] = useState(true);
  const [showTrailingIcon, setShowTrailingIcon] = useState(true);

  const forceState = useMemo(() => state, [state]);
  const leadingIcon = showLeadingIcon ? '●' : undefined;
  const trailingIcon = showTrailingIcon ? '#' : undefined;

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: colors.semantic.theme.background.surface.default,
        color: colors.semantic.theme.text.base.primary,
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
            Badge Preview
          </h1>
          <p
            style={{
              margin: 0,
              color: colors.semantic.theme.text.base.secondary,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma MCP 기반 Badge variant/stroke/state 검증 프리뷰
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Color</span>
            <select
              value={color}
              onChange={(event) => setColor(event.target.value as BadgeColor)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.semantic.theme.border.base.neutral,
                backgroundColor: colors.semantic.theme.background.input.normal,
                color: colors.semantic.theme.text.base.primary,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {COLORS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as BadgeSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.semantic.theme.border.base.neutral,
                backgroundColor: colors.semantic.theme.background.input.normal,
                color: colors.semantic.theme.text.base.primary,
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Shape</span>
            <select
              value={shape}
              onChange={(event) => setShape(event.target.value as BadgeShape)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.semantic.theme.border.base.neutral,
                backgroundColor: colors.semantic.theme.background.input.normal,
                color: colors.semantic.theme.text.base.primary,
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as BadgeVisualState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.semantic.theme.border.base.neutral,
                backgroundColor: colors.semantic.theme.background.input.normal,
                color: colors.semantic.theme.text.base.primary,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {STATE_OPTIONS.map((item) => (
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
              borderWidth: spacing.scale['1'],
              borderColor: colors.semantic.theme.border.base.neutral,
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.semantic.theme.background.input.normal,
            }}
          >
            <span>Stroke</span>
            <input type="checkbox" checked={stroke} onChange={(event) => setStroke(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.semantic.theme.border.base.neutral,
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.semantic.theme.background.input.normal,
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
              borderColor: colors.semantic.theme.border.base.neutral,
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.semantic.theme.background.input.normal,
            }}
          >
            <span>Leading Icon</span>
            <input type="checkbox" checked={showLeadingIcon} onChange={(event) => setShowLeadingIcon(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.semantic.theme.border.base.neutral,
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.semantic.theme.background.input.normal,
            }}
          >
            <span>Trailing Icon</span>
            <input type="checkbox" checked={showTrailingIcon} onChange={(event) => setShowTrailingIcon(event.target.checked)} />
          </label>
        </div>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.semantic.theme.border.base.neutral,
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.semantic.theme.background.surface.neutral,
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: spacing.scale['160'] }}>
            <Badge
              color={color}
              size={size}
              shape={shape}
              stroke={stroke}
              forceState={forceState}
              disabled={disabled}
              leadingIcon={leadingIcon}
              trailingIcon={trailingIcon}
            >
              Badge
            </Badge>
          </div>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.semantic.theme.border.base.neutral,
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.semantic.theme.background.surface.neutral,
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
            Color Matrix
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
              gap: spacing.scale['12'],
            }}
          >
            {COLORS.map((item) => (
              <div
                key={item}
                style={{
                  borderStyle: 'solid',
                  borderWidth: spacing.scale['1'],
                  borderColor: colors.semantic.theme.border.base.neutral,
                  borderRadius: spacing.scale['8'],
                  padding: spacing.scale['12'],
                  display: 'grid',
                  gap: spacing.scale['8'],
                }}
              >
                <span style={{ color: colors.semantic.theme.text.base.secondary, fontSize: typography.scale.captionM.medium.fontSize }}>
                  {toTitle(item)}
                </span>
                <div style={{ display: 'flex', gap: spacing.scale['8'], flexWrap: 'wrap' }}>
                  <Badge
                    color={item}
                    size={size}
                    shape={shape}
                    stroke={stroke}
                    forceState="default"
                    leadingIcon={leadingIcon}
                    trailingIcon={trailingIcon}
                  >
                    Default
                  </Badge>
                  <Badge
                    color={item}
                    size={size}
                    shape={shape}
                    stroke={stroke}
                    forceState="disabled"
                    disabled
                    leadingIcon={leadingIcon}
                    trailingIcon={trailingIcon}
                  >
                    Disabled
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
