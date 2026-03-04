import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { QuantityStepper } from './QuantityStepper';
import type { QuantityStepperShape, QuantityStepperSize, QuantityStepperState } from './QuantityStepper.types';

const SIZES: QuantityStepperSize[] = ['lg', 'md'];
const SHAPES: QuantityStepperShape[] = ['rounded', 'pill'];
const STATES: Array<'auto' | QuantityStepperState> = ['auto', 'default', 'hover', 'focused', 'disabled'];

function toTitle(value: string): string {
  return value.replace(/^./, (char) => char.toUpperCase());
}

export default function QuantityStepperPreviewPage() {
  const [size, setSize] = useState<QuantityStepperSize>('lg');
  const [shape, setShape] = useState<QuantityStepperShape>('rounded');
  const [state, setState] = useState<'auto' | QuantityStepperState>('auto');
  const [value, setValue] = useState<number>(spacing.scale['2']);
  const [min, setMin] = useState<number>(spacing.scale['0']);
  const [max, setMax] = useState<number>(spacing.scale['10']);
  const [step, setStep] = useState<number>(spacing.scale['1']);
  const [disabled, setDisabled] = useState(false);
  const [lastAction, setLastAction] = useState('None');

  const forcedState = useMemo(() => {
    if (state === 'auto') {
      return disabled ? ('disabled' as const) : undefined;
    }
    return state;
  }, [disabled, state]);

  const clampedValue = useMemo(() => Math.max(min, Math.min(max, value)), [max, min, value]);

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
            Quantity Stepper Preview
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
            Figma Variant(`size`, `shape`, `state`)과 값 증감 동작/접근성 상태를 검증합니다.
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
            <span>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as QuantityStepperSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
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
            <span>Shape</span>
            <select
              value={shape}
              onChange={(event) => setShape(event.target.value as QuantityStepperShape)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
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
            <span>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as 'auto' | QuantityStepperState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
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
            <span>Value</span>
            <input
              type="number"
              value={clampedValue}
              onChange={(event) => setValue(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Min</span>
            <input
              type="number"
              value={min}
              onChange={(event) => setMin(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Max</span>
            <input
              type="number"
              value={max}
              onChange={(event) => setMax(Number(event.target.value))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Step</span>
            <input
              type="number"
              min={spacing.scale['1']}
              value={step}
              onChange={(event) => setStep(Math.max(spacing.scale['1'], Number(event.target.value)))}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            />
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
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: radius.scale.xl,
            backgroundColor: colors.primitive.palette.gray['1'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            justifyItems: 'start',
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
            Live Preview
          </h2>

          <QuantityStepper
            size={size}
            shape={shape}
            state={forcedState}
            value={clampedValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onValueChange={(next) => {
              setValue(next);
              setLastAction(`Value changed: ${next}`);
            }}
            onDecrease={(next) => setLastAction(`Decrease: ${next}`)}
            onIncrease={(next) => setLastAction(`Increase: ${next}`)}
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
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Variant Matrix
          </h2>

          {SIZES.map((sizeItem) => (
            <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['8'] }}>
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
                Size {sizeItem.toUpperCase()}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale['12'], flexWrap: 'wrap' }}>
                {SHAPES.map((shapeItem) => (
                  <QuantityStepper
                    key={`${sizeItem}-${shapeItem}`}
                    size={sizeItem}
                    shape={shapeItem}
                    state={forcedState}
                    value={clampedValue}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    onValueChange={setValue}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

