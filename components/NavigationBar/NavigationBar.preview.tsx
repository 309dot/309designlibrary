import React, { useEffect, useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { NavigationBar } from './NavigationBar';
import type { NavigationBarInteractionState, NavigationBarLinkItem, NavigationBarType } from './NavigationBar.types';

const TYPES: NavigationBarType[] = ['01', '02', '03', '04', '05', '06', '07', '08'];
const INTERACTION_STATES: NavigationBarInteractionState[] = ['default', 'hover', 'focus', 'disabled'];
const WIDTH_OPTIONS = [spacing.scale['1024'], spacing.scale['1440']] as const;

const DEFAULT_BOTTOM_LINKS: NavigationBarLinkItem[] = [
  { id: 'library', label: 'Library' },
  { id: 'studio', label: 'Studio', badgeText: '12' },
  { id: 'pronunciation-dictionary', label: 'Pronunciation Dictionary' },
  { id: 'voice-cloning', label: 'Voice Cloning', badgeText: '08' },
];

const CUSTOM_MAIN_LINKS: NavigationBarLinkItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'docs', label: 'Docs' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'community', label: 'Community', hasChevron: true },
];

const CUSTOM_BOTTOM_LINKS: NavigationBarLinkItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'insights', label: 'Insights', badgeText: '04' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings', badgeText: '02' },
];

function toTitle(value: string): string {
  return value.replace(/^./, (first) => first.toUpperCase());
}

export default function NavigationBarPreviewPage() {
  const [type, setType] = useState<NavigationBarType>('01');
  const [interactionState, setInteractionState] = useState<NavigationBarInteractionState>('default');
  const [width, setWidth] = useState<number>(spacing.scale['1440']);
  const [useCustomLinks, setUseCustomLinks] = useState(false);
  const [activeBottomLinkId, setActiveBottomLinkId] = useState(DEFAULT_BOTTOM_LINKS[1].id);
  const [lastAction, setLastAction] = useState('None');

  const resolvedMainLinks = useMemo(() => (useCustomLinks ? CUSTOM_MAIN_LINKS : undefined), [useCustomLinks]);
  const resolvedBottomLinks = useMemo(() => (useCustomLinks ? CUSTOM_BOTTOM_LINKS : DEFAULT_BOTTOM_LINKS), [useCustomLinks]);

  useEffect(() => {
    if (resolvedBottomLinks.some((item) => item.id === activeBottomLinkId)) {
      return;
    }

    if (resolvedBottomLinks.length > spacing.scale['0']) {
      setActiveBottomLinkId(resolvedBottomLinks[spacing.scale['0']].id);
    }
  }, [activeBottomLinkId, resolvedBottomLinks]);

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
        padding: spacing.scale['24'],
        backgroundColor: colors.primitive.palette.base.white,
        color: colors.semantic.theme.text.base.staticDark,
        fontFamily: typography.scale.bodyM.medium.fontFamily,
      }}
    >
      <section
        style={{
          maxWidth: spacing.scale['1440'],
          marginInline: 'auto',
          display: 'grid',
          gap: spacing.scale['24'],
        }}
      >
        <header style={{ display: 'grid', gap: spacing.scale['8'] }}>
          <h1
            style={{
              margin: spacing.scale['0'],
              ...{
                fontFamily: typography.scale.h3.bold.fontFamily,
                fontSize: typography.scale.h3.bold.fontSize,
                fontWeight: typography.scale.h3.bold.fontWeight,
                lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
                letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
              },
            }}
          >
            Navigation Bar Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              ...{
                fontFamily: typography.scale.bodyS.regular.fontFamily,
                fontSize: typography.scale.bodyS.regular.fontSize,
                fontWeight: typography.scale.bodyS.regular.fontWeight,
                lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
                letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
              },
            }}
          >
            Figma `Type=01~08` 변형과 상호작용 상태를 한 화면에서 검증합니다.
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
              onChange={(event) => setType(event.target.value as NavigationBarType)}
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
                  Type {item}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Interaction State</span>
            <select
              value={interactionState}
              onChange={(event) => setInteractionState(event.target.value as NavigationBarInteractionState)}
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
            <span>Width</span>
            <select
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
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
              {WIDTH_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}px
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Type 08 Active Tab</span>
            <select
              value={activeBottomLinkId}
              onChange={(event) => setActiveBottomLinkId(event.target.value)}
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
              {resolvedBottomLinks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
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
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Custom Links</span>
            <input type="checkbox" checked={useCustomLinks} onChange={(event) => setUseCustomLinks(event.target.checked)} />
          </label>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: colors.primitive.palette.gray['1'],
            padding: spacing.scale['16'],
            display: 'grid',
            gap: spacing.scale['12'],
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              ...{
                fontFamily: typography.scale.h5.semiBold.fontFamily,
                fontSize: typography.scale.h5.semiBold.fontSize,
                fontWeight: typography.scale.h5.semiBold.fontWeight,
                lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
                letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
              },
            }}
          >
            Selected Variant
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <NavigationBar
              type={type}
              width={width}
              interactionState={interactionState}
              links={resolvedMainLinks}
              bottomLinks={resolvedBottomLinks}
              activeBottomLinkId={activeBottomLinkId}
              onLinkClick={(id) => setLastAction(`Main: ${id}`)}
              onBottomLinkClick={(id) => {
                setLastAction(`Bottom: ${id}`);
                if (id !== 'help') {
                  setActiveBottomLinkId(id);
                }
              }}
              onCtaClick={() => setLastAction('CTA: try-for-free')}
            />
          </div>

          <p
            style={{
              margin: spacing.scale['0'],
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              ...{
                fontFamily: typography.scale.captionL.regular.fontFamily,
                fontSize: typography.scale.captionL.regular.fontSize,
                fontWeight: typography.scale.captionL.regular.fontWeight,
                lineHeight: `${typography.scale.captionL.regular.lineHeight}px`,
                letterSpacing: `${typography.scale.captionL.regular.letterSpacing}px`,
              },
            }}
          >
            Last Action: {lastAction}
          </p>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: border.width['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: colors.primitive.palette.gray['1'],
            padding: spacing.scale['16'],
            display: 'grid',
            gap: spacing.scale['12'],
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              ...{
                fontFamily: typography.scale.h5.semiBold.fontFamily,
                fontSize: typography.scale.h5.semiBold.fontSize,
                fontWeight: typography.scale.h5.semiBold.fontWeight,
                lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
                letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
              },
            }}
          >
            All Types
          </h2>

          {TYPES.map((variant) => (
            <div key={variant} style={{ display: 'grid', gap: spacing.scale['4'] }}>
              <span
                style={{
                  color: colors.semantic.theme.text.base.staticDarkSecondary,
                  ...{
                    fontFamily: typography.scale.captionL.medium.fontFamily,
                    fontSize: typography.scale.captionL.medium.fontSize,
                    fontWeight: typography.scale.captionL.medium.fontWeight,
                    lineHeight: `${typography.scale.captionL.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionL.medium.letterSpacing}px`,
                  },
                }}
              >
                Type {variant}
              </span>
              <div style={{ overflowX: 'auto' }}>
                <NavigationBar
                  type={variant}
                  width={spacing.scale['1024']}
                  interactionState={interactionState}
                  links={resolvedMainLinks}
                  bottomLinks={resolvedBottomLinks}
                  activeBottomLinkId={activeBottomLinkId}
                  onLinkClick={(id) => setLastAction(`Main: ${id}`)}
                  onBottomLinkClick={(id) => {
                    setLastAction(`Bottom: ${id}`);
                    if (id !== 'help') {
                      setActiveBottomLinkId(id);
                    }
                  }}
                  onCtaClick={() => setLastAction('CTA: try-for-free')}
                />
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

