import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Pagenation } from './Pagenation';
import type { PagenationInteractionState, PagenationNumberItem, PagenationSize, PagenationType } from './Pagenation.types';

const TYPES: PagenationType[] = ['arrows', 'numbers', 'buttons'];
const SIZES: PagenationSize[] = ['md', 'sm'];
const INTERACTION_STATES: PagenationInteractionState[] = ['default', 'hover', 'focus', 'disabled'];
const PAGE_OPTIONS = ['1', '56', '57', '58', '100'] as const;
const DOT_OPTIONS = [
  spacing.primitive['0'],
  spacing.primitive['1'],
  spacing.primitive['2'],
  spacing.primitive['3'],
  spacing.primitive['4'],
  spacing.primitive['5'],
] as const;

function toTitle(value: string): string {
  return value.replace(/^./, (first) => first.toUpperCase());
}

function buildNumberItems(activePage: string): PagenationNumberItem[] {
  return [
    { id: 'page-1', label: '1', active: activePage === '1' },
    { id: 'more-left', label: '...', kind: 'more', disabled: true },
    { id: 'page-56', label: '56', active: activePage === '56' },
    { id: 'page-57', label: '57', active: activePage === '57' },
    { id: 'page-58', label: '58', active: activePage === '58' },
    { id: 'more-right', label: '...', kind: 'more', disabled: true },
    { id: 'page-100', label: '100', active: activePage === '100' },
  ];
}

export default function PagenationPreviewPage() {
  const [type, setType] = useState<PagenationType>('numbers');
  const [size, setSize] = useState<PagenationSize>('md');
  const [interactionState, setInteractionState] = useState<PagenationInteractionState>('default');
  const [showDots, setShowDots] = useState(true);
  const [activeDotIndex, setActiveDotIndex] = useState<number>(spacing.primitive['0']);
  const [activePage, setActivePage] = useState<(typeof PAGE_OPTIONS)[number]>('57');
  const [lastAction, setLastAction] = useState('None');

  const numberItems = useMemo(() => buildNumberItems(activePage), [activePage]);
  const shouldShowDotsToggle = type === 'arrows' || type === 'buttons';

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
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
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Pagenation Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              fontFamily: typography.scale.bodyS.regular.fontFamily,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma Variant(`Type`, `Size`)와 Number Active/Interaction 상태를 인터랙티브하게 검증합니다.
          </p>
        </header>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: colors.primitive.palette.gray['1'],
            padding: spacing.scale['16'],
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as PagenationType)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
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
            <span>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as PagenationSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
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
            <span>Interaction State</span>
            <select
              value={interactionState}
              onChange={(event) => setInteractionState(event.target.value as PagenationInteractionState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
              }}
            >
              {INTERACTION_STATES.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Active Page (Numbers)</span>
            <select
              value={activePage}
              onChange={(event) => setActivePage(event.target.value as (typeof PAGE_OPTIONS)[number])}
              disabled={type !== 'numbers'}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: type === 'numbers' ? colors.primitive.palette.base.white : colors.primitive.palette.gray['2'],
                color: colors.semantic.theme.text.base.staticDark,
              }}
            >
              {PAGE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Active Dot</span>
            <select
              value={activeDotIndex}
              onChange={(event) => setActiveDotIndex(Number(event.target.value))}
              disabled={!shouldShowDotsToggle}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: shouldShowDotsToggle ? colors.primitive.palette.base.white : colors.primitive.palette.gray['2'],
                color: colors.semantic.theme.text.base.staticDark,
              }}
            >
              {DOT_OPTIONS.map((item) => (
                <option key={`dot-${item}`} value={item}>
                  {item + spacing.primitive['1']}
                </option>
              ))}
            </select>
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: radius.scale.md,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: shouldShowDotsToggle ? colors.primitive.palette.base.white : colors.primitive.palette.gray['2'],
            }}
          >
            <span>Show Dots</span>
            <input
              type="checkbox"
              checked={showDots}
              disabled={!shouldShowDotsToggle}
              onChange={(event) => setShowDots(event.target.checked)}
            />
          </label>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: colors.primitive.palette.gray['1'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['12'],
            justifyItems: 'center',
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              justifySelf: 'start',
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Live Preview
          </h2>

          <Pagenation
            type={type}
            size={size}
            interactionState={interactionState}
            showDots={showDots}
            dotCount={DOT_OPTIONS.length}
            activeDotIndex={activeDotIndex}
            numberItems={numberItems}
            onPrevClick={() => setLastAction('Prev')}
            onNextClick={() => setLastAction('Next')}
            onNumberClick={(id) => {
              setLastAction(`Page: ${id}`);
              const parsed = id.replace('page-', '');
              if (PAGE_OPTIONS.includes(parsed as (typeof PAGE_OPTIONS)[number])) {
                setActivePage(parsed as (typeof PAGE_OPTIONS)[number]);
              }
            }}
            onLeftButtonClick={() => setLastAction('Left Button')}
            onRightButtonClick={() => setLastAction('Right Button')}
          />

          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              fontFamily: typography.scale.captionL.regular.fontFamily,
              fontSize: typography.scale.captionL.regular.fontSize,
              fontWeight: typography.scale.captionL.regular.fontWeight,
              lineHeight: `${typography.scale.captionL.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.captionL.regular.letterSpacing}px`,
            }}
          >
            Last Action: {lastAction}
          </p>
        </section>
      </section>
    </main>
  );
}
