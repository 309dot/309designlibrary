import React, { useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbsDivider, BreadcrumbsSize, BreadcrumbsVisualState } from './Breadcrumbs.types';

const SIZES: BreadcrumbsSize[] = ['sm', 'md'];
const DIVIDERS: BreadcrumbsDivider[] = ['icon', 'slash'];
const STATES: BreadcrumbsVisualState[] = ['default', 'hover', 'focus', 'disabled'];

function toTitle(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

export default function BreadcrumbsPreviewPage() {
  const [size, setSize] = useState<BreadcrumbsSize>('sm');
  const [divider, setDivider] = useState<BreadcrumbsDivider>('icon');
  const [state, setState] = useState<BreadcrumbsVisualState>('default');

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
            Breadcrumbs Preview
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
            Figma MCP variant(`size`, `divider`)과 상태 강제 토글(`forceState`) 검증
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as BreadcrumbsSize)}
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Divider</span>
            <select
              value={divider}
              onChange={(event) => setDivider(event.target.value as BreadcrumbsDivider)}
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
              {DIVIDERS.map((item) => (
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
              onChange={(event) => setState(event.target.value as BreadcrumbsVisualState)}
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
              {STATES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
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

          <div
            style={{
              display: 'grid',
              gap: spacing.scale['20'],
              paddingBlock: spacing.scale['8'],
            }}
          >
            <Breadcrumbs
              size={size}
              divider={divider}
              forceState={state}
              items={[
                { label: 'Home', href: '#' },
                { label: 'Design', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Breadcrumbs', current: true },
              ]}
            />
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
            Variant Matrix
          </h2>

          <div
            style={{
              display: 'grid',
              gap: spacing.scale['16'],
            }}
          >
            {SIZES.map((sizeItem) => (
              <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['8'] }}>
                <span
                  style={{
                    color: colors.semantic.theme.text.base.secondary,
                    fontSize: typography.scale.captionM.medium.fontSize,
                    fontWeight: typography.scale.captionM.medium.fontWeight,
                    lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                  }}
                >
                  Size {sizeItem.toUpperCase()}
                </span>

                {DIVIDERS.map((dividerItem) => (
                  <Breadcrumbs
                    key={`${sizeItem}-${dividerItem}`}
                    size={sizeItem}
                    divider={dividerItem}
                    forceState="default"
                    items={[
                      { label: 'Workspace', href: '#' },
                      { label: 'Library', href: '#' },
                      { label: 'Breadcrumbs', current: true },
                    ]}
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
