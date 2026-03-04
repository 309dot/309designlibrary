import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Toggle } from './Toggle';
import type { ToggleSize, ToggleVisualState } from './Toggle.types';

const SIZES: ToggleSize[] = ['sm', 'md'];
const STATES: Array<'auto' | ToggleVisualState> = ['auto', 'default', 'hover', 'focus', 'disabled'];
const ACTIVE_OPTIONS: boolean[] = [false, true];

const textBase = colors.semantic.theme.text.base;
const palette = colors.primitive.palette;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TogglePreviewPage() {
  const [size, setSize] = useState<ToggleSize>('md');
  const [state, setState] = useState<'auto' | ToggleVisualState>('auto');
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const forcedState = useMemo<ToggleVisualState | undefined>(() => {
    if (disabled) {
      return 'disabled';
    }

    if (state === 'auto') {
      return undefined;
    }

    return state;
  }, [disabled, state]);

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
            Toggle Preview
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
            Figma variant(`Size`, `Active`, `State`) 기반 Toggle 인터랙션 검증
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
              onChange={(event) => setSize(event.target.value as ToggleSize)}
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
            <span>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as 'auto' | ToggleVisualState)}
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
            <span>Active</span>
            <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
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

          <Toggle size={size} checked={checked} disabled={disabled} state={forcedState} onCheckedChange={setChecked} aria-label="Preview toggle" />
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
            Variant Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['16'] }}>
            {SIZES.map((sizeItem) => (
              <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['8'] }}>
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

                {(['default', 'hover', 'focus', 'disabled'] as ToggleVisualState[]).map((stateItem) => (
                  <div
                    key={`${sizeItem}-${stateItem}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `${spacing.scale['96']}px 1fr 1fr`,
                      alignItems: 'center',
                      gap: spacing.scale['12'],
                    }}
                  >
                    <span
                      style={{
                        color: textBase.staticDarkSecondary,
                        fontFamily: typography.scale.captionL.regular.fontFamily,
                        fontSize: typography.scale.captionL.regular.fontSize,
                        fontWeight: typography.scale.captionL.regular.fontWeight,
                        lineHeight: `${typography.scale.captionL.regular.lineHeight}px`,
                        letterSpacing: `${typography.scale.captionL.regular.letterSpacing}px`,
                      }}
                    >
                      {toTitle(stateItem)}
                    </span>

                    {ACTIVE_OPTIONS.map((activeItem) => (
                      <div
                        key={`${sizeItem}-${stateItem}-${activeItem ? 'on' : 'off'}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: spacing.scale['8'],
                        }}
                      >
                        <Toggle size={sizeItem} checked={activeItem} state={stateItem} aria-label={`${sizeItem}-${stateItem}-${activeItem ? 'on' : 'off'}`} />
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
                          {activeItem ? 'Active=True' : 'Active=False'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
