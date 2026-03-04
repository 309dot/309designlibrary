import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Tooltip, TooltipTrigger } from './Tooltip';
import type { TooltipPlacement, TooltipSize } from './Tooltip.types';

const SIZES: TooltipSize[] = ['sm', 'md', 'lg'];
const PLACEMENTS: TooltipPlacement[] = [
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'topLeft',
  'topCenter',
  'topRight',
  'rightSide',
  'leftSide',
];

const LG_PLACEMENTS: TooltipPlacement[] = ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'];

const textBase = colors.semantic.theme.text.base;
const palette = colors.primitive.palette;

function toTitle(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function getSupportedPlacements(size: TooltipSize): TooltipPlacement[] {
  if (size === 'lg') {
    return LG_PLACEMENTS;
  }

  return PLACEMENTS;
}

export default function TooltipPreviewPage() {
  const [size, setSize] = useState<TooltipSize>('sm');
  const [placement, setPlacement] = useState<TooltipPlacement>('bottomCenter');
  const [triggerActive, setTriggerActive] = useState(false);
  const [triggerDisabled, setTriggerDisabled] = useState(false);

  const supportedPlacements = useMemo(() => getSupportedPlacements(size), [size]);

  const resolvedPlacement = supportedPlacements.includes(placement) ? placement : supportedPlacements[0];

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
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Tooltip Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textBase.staticDarkSecondary,
              fontFamily: typography.scale.bodyS.regular.fontFamily,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma MCP 노드 `1428:49982`(Tooltip), `575:31201`(Tooltip Trigger) variant 검증
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
            <span>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as TooltipSize)}
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
            <span>Placement</span>
            <select
              value={resolvedPlacement}
              onChange={(event) => setPlacement(event.target.value as TooltipPlacement)}
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
              {supportedPlacements.map((item) => (
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
            <span>Trigger Active</span>
            <input type="checkbox" checked={triggerActive} onChange={(event) => setTriggerActive(event.target.checked)} />
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
            <span>Trigger Disabled</span>
            <input type="checkbox" checked={triggerDisabled} onChange={(event) => setTriggerDisabled(event.target.checked)} />
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
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
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
              minHeight: spacing.scale['192'],
              display: 'grid',
              placeItems: 'center',
              borderStyle: 'dashed',
              borderWidth: border.width['1'],
              borderColor: palette.gray['4'],
              borderRadius: radius.scale.lg,
              padding: spacing.scale['16'],
              backgroundColor: palette.base.white,
            }}
          >
            <Tooltip size={size} placement={resolvedPlacement} />
          </div>

          <div
            style={{
              minHeight: spacing.scale['120'],
              display: 'grid',
              placeItems: 'center',
              borderStyle: 'dashed',
              borderWidth: border.width['1'],
              borderColor: palette.gray['4'],
              borderRadius: radius.scale.lg,
              padding: spacing.scale['16'],
              backgroundColor: palette.base.white,
            }}
          >
            <TooltipTrigger active={triggerActive} disabled={triggerDisabled} onActiveChange={setTriggerActive} />
          </div>
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
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Tooltip Variant Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['20'] }}>
            {SIZES.map((sizeItem) => {
              const placements = getSupportedPlacements(sizeItem);

              return (
                <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['12'] }}>
                  <span
                    style={{
                      color: textBase.staticDarkSecondary,
                      fontFamily: typography.scale.captionL.medium.fontFamily,
                      fontSize: typography.scale.captionL.medium.fontSize,
                      fontWeight: typography.scale.captionL.medium.fontWeight,
                      lineHeight: `${typography.scale.captionL.medium.lineHeight}px`,
                      letterSpacing: `${typography.scale.captionL.medium.letterSpacing}px`,
                    }}
                  >
                    Size {sizeItem.toUpperCase()}
                  </span>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
                      gap: spacing.scale['12'],
                    }}
                  >
                    {placements.map((placementItem) => (
                      <div
                        key={`${sizeItem}-${placementItem}`}
                        style={{
                          borderStyle: 'solid',
                          borderWidth: border.width['1'],
                          borderColor: palette.gray['3'],
                          borderRadius: radius.scale.md,
                          backgroundColor: palette.base.white,
                          padding: spacing.scale['12'],
                          display: 'grid',
                          gap: spacing.scale['8'],
                        }}
                      >
                        <span
                          style={{
                            color: textBase.staticDarkSecondary,
                            fontFamily: typography.scale.captionM.medium.fontFamily,
                            fontSize: typography.scale.captionM.medium.fontSize,
                            fontWeight: typography.scale.captionM.medium.fontWeight,
                            lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                            letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                          }}
                        >
                          {toTitle(placementItem)}
                        </span>

                        <div style={{ minHeight: spacing.scale['80'], display: 'grid', placeItems: 'center' }}>
                          <Tooltip size={sizeItem} placement={placementItem} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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
          }}
        >
          <h2
            style={{
              margin: spacing.scale['0'],
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Trigger Variant Matrix
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, minmax(${spacing.scale['224']}px, 1fr))`, gap: spacing.scale['12'] }}>
            {[false, true].map((activeItem) => (
              <div
                key={activeItem ? 'trigger-on' : 'trigger-off'}
                style={{
                  borderStyle: 'solid',
                  borderWidth: border.width['1'],
                  borderColor: palette.gray['3'],
                  borderRadius: radius.scale.md,
                  backgroundColor: palette.base.white,
                  padding: spacing.scale['12'],
                  display: 'grid',
                  gap: spacing.scale['8'],
                }}
              >
                <span
                  style={{
                    color: textBase.staticDarkSecondary,
                    fontFamily: typography.scale.captionM.medium.fontFamily,
                    fontSize: typography.scale.captionM.medium.fontSize,
                    fontWeight: typography.scale.captionM.medium.fontWeight,
                    lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                  }}
                >
                  Active={String(activeItem)}
                </span>

                <div style={{ minHeight: spacing.scale['80'], display: 'grid', placeItems: 'center' }}>
                  <TooltipTrigger active={activeItem} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
