import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Radio } from './Radio';
import type { RadioSize, RadioVisualState } from './Radio.types';

const SIZES: RadioSize[] = ['sm', 'md'];
const STATES: Array<'auto' | RadioVisualState> = ['auto', 'default', 'hover', 'focus', 'disabled'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function RadioPreviewPage() {
  const [size, setSize] = useState<RadioSize>('sm');
  const [state, setState] = useState<'auto' | RadioVisualState>('auto');
  const [checked, setChecked] = useState(false);

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
            Radio Preview
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
            Figma variant(Size/Active/State) 대응 인터랙션 검증
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
              onChange={(event) => setSize(event.target.value as RadioSize)}
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
              onChange={(event) => setState(event.target.value as 'auto' | RadioVisualState)}
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
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
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

          <Radio
            size={size}
            checked={checked}
            state={state === 'auto' ? undefined : state}
            onCheckedChange={setChecked}
            ariaLabel="Preview radio"
          />
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

          <div
            style={{
              display: 'grid',
              gap: spacing.scale['16'],
            }}
          >
            {SIZES.map((sizeItem) => (
              <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['8'] }}>
                <h3
                  style={{
                    margin: spacing.scale['0'],
                    fontFamily: typography.scale.bodyM.semiBold.fontFamily,
                    fontSize: typography.scale.bodyM.semiBold.fontSize,
                    fontWeight: typography.scale.bodyM.semiBold.fontWeight,
                    lineHeight: `${typography.scale.bodyM.semiBold.lineHeight}px`,
                    letterSpacing: `${typography.scale.bodyM.semiBold.letterSpacing}px`,
                  }}
                >
                  Size {sizeItem.toUpperCase()}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(4, minmax(${spacing.scale['120']}px, 1fr))`,
                    gap: spacing.scale['12'],
                  }}
                >
                  {( ['default', 'hover', 'focus', 'disabled'] as RadioVisualState[] ).map((stateItem) => (
                    <div
                      key={`${sizeItem}-inactive-${stateItem}`}
                      style={{
                        display: 'grid',
                        gap: spacing.scale['8'],
                        padding: spacing.scale['12'],
                        borderStyle: 'solid',
                        borderWidth: border.width['1'],
                        borderColor: palette.gray['3'],
                        borderRadius: radius.scale.md,
                        backgroundColor: palette.base.white,
                        justifyItems: 'start',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: typography.scale.captionM.regular.fontFamily,
                          fontSize: typography.scale.captionM.regular.fontSize,
                          fontWeight: typography.scale.captionM.regular.fontWeight,
                          lineHeight: `${typography.scale.captionM.regular.lineHeight}px`,
                          letterSpacing: `${typography.scale.captionM.regular.letterSpacing}px`,
                          color: textBase.staticDarkSecondary,
                        }}
                      >
                        Inactive / {toTitle(stateItem)}
                      </span>
                      <Radio size={sizeItem} checked={false} state={stateItem} ariaLabel="Matrix radio inactive" />
                    </div>
                  ))}

                  {( ['default', 'hover', 'focus', 'disabled'] as RadioVisualState[] ).map((stateItem) => (
                    <div
                      key={`${sizeItem}-active-${stateItem}`}
                      style={{
                        display: 'grid',
                        gap: spacing.scale['8'],
                        padding: spacing.scale['12'],
                        borderStyle: 'solid',
                        borderWidth: border.width['1'],
                        borderColor: palette.gray['3'],
                        borderRadius: radius.scale.md,
                        backgroundColor: palette.base.white,
                        justifyItems: 'start',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: typography.scale.captionM.regular.fontFamily,
                          fontSize: typography.scale.captionM.regular.fontSize,
                          fontWeight: typography.scale.captionM.regular.fontWeight,
                          lineHeight: `${typography.scale.captionM.regular.lineHeight}px`,
                          letterSpacing: `${typography.scale.captionM.regular.letterSpacing}px`,
                          color: textBase.staticDarkSecondary,
                        }}
                      >
                        Active / {toTitle(stateItem)}
                      </span>
                      <Radio size={sizeItem} checked state={stateItem} ariaLabel="Matrix radio active" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
