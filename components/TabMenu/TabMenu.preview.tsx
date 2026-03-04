import React, { useEffect, useMemo, useState } from 'react';

import { colors, spacing, typography } from '../../style-tokens';

import { TabMenu } from './TabMenu';
import type { TabMenuItem, TabMenuSize, TabMenuType, TabMenuVisualState } from './TabMenu.types';

const TYPES: TabMenuType[] = ['fill', 'line', 'segmented'];
const SIZES: TabMenuSize[] = ['lg', 'md', 'sm'];
const STATES: TabMenuVisualState[] = ['default', 'hover', 'focus', 'disabled'];

const LINEAR_ITEMS: TabMenuItem[] = [
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

const SEGMENTED_ITEMS: TabMenuItem[] = LINEAR_ITEMS.slice(0, 5);

function toTitle(value: string): string {
  return value.replace(/^./, (char) => char.toUpperCase());
}

function withBadgeToggle(items: TabMenuItem[], showBadge: boolean): TabMenuItem[] {
  if (showBadge) {
    return items;
  }

  return items.map(({ badge: _badge, ...rest }) => rest);
}

function getDefaultSelectedId(items: TabMenuItem[]): string {
  return items[1]?.id ?? items[0]?.id ?? '';
}

export default function TabMenuPreviewPage() {
  const [type, setType] = useState<TabMenuType>('fill');
  const [size, setSize] = useState<TabMenuSize>('md');
  const [state, setState] = useState<TabMenuVisualState>('default');
  const [disabled, setDisabled] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  const items = useMemo(() => {
    const base = type === 'segmented' ? SEGMENTED_ITEMS : LINEAR_ITEMS;
    return withBadgeToggle(base, showBadge);
  }, [type, showBadge]);

  const [selectedId, setSelectedId] = useState<string>(getDefaultSelectedId(items));

  useEffect(() => {
    const exists = items.some((item) => item.id === selectedId);

    if (!exists) {
      setSelectedId(getDefaultSelectedId(items));
    }
  }, [items, selectedId]);

  const tokenNotice =
    state === 'default'
      ? 'Figma Tab Menu는 hover/focus/disabled 전용 시각 variant가 없어 default와 동일한 시각값을 사용합니다.'
      : `${toTitle(state)} 강제 상태는 접근성/행동 검증용이며, 시각값은 Figma 기본 variant를 유지합니다.`;

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
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Tab Menu Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.secondary,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma MCP 노드 `953:18063` 기반 Type/Size/상태 프리뷰
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as TabMenuType)}
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
              {TYPES.map((item) => (
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
              onChange={(event) => setSize(event.target.value as TabMenuSize)}
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
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as TabMenuVisualState)}
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
            <span>Badge</span>
            <input type="checkbox" checked={showBadge} onChange={(event) => setShowBadge(event.target.checked)} />
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.secondary }}>Selected</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
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
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
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
            backgroundColor: colors.semantic.theme.background.surface.neutralSubtle,
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
          }}
        >
          <div
            style={{
              padding: spacing.scale['16'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.semantic.theme.border.base.neutral,
              borderRadius: spacing.scale['12'],
              backgroundColor: colors.semantic.theme.background.surface.default,
              overflowX: 'auto',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <TabMenu
              type={type}
              size={size}
              items={items}
              selectedId={selectedId}
              disabled={disabled}
              forceItemState={state}
              onSelectedIdChange={setSelectedId}
            />
          </div>

          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.secondary,
              fontSize: typography.scale.captionL.regular.fontSize,
              fontWeight: typography.scale.captionL.regular.fontWeight,
              lineHeight: `${typography.scale.captionL.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.captionL.regular.letterSpacing}px`,
            }}
          >
            {tokenNotice}
          </p>
        </section>
      </section>
    </main>
  );
}
