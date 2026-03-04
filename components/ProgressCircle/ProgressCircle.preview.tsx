import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { ProgressCircle } from './ProgressCircle';
import type { ProgressCircleColor, ProgressCircleInteractionState, ProgressCircleSize } from './ProgressCircle.types';

const SIZES: ProgressCircleSize[] = ['xs', 'sm', 'md', 'lg'];
const COLORS: ProgressCircleColor[] = ['green', 'purple', 'red'];
const INTERACTION_STATES: ProgressCircleInteractionState[] = ['default', 'hover', 'focus', 'disabled'];

const PROGRESS_MIN = spacing.scale['0'];
const PROGRESS_MAX = spacing.scale['10'] * spacing.scale['10'];

function toTitle(value: string): string {
  return value.replace(/^./, (char) => char.toUpperCase());
}

export default function ProgressCirclePreviewPage() {
  const [size, setSize] = useState<ProgressCircleSize>('md');
  const [color, setColor] = useState<ProgressCircleColor>('green');
  const [interactionState, setInteractionState] = useState<ProgressCircleInteractionState>('default');
  const [progressValue, setProgressValue] = useState<number>(spacing.scale['50']);
  const [showLabel, setShowLabel] = useState(true);

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
            Progress Circle Preview
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
            Figma Variant(`Size=xs|sm|md|lg`)와 Circle 내부 축(`Color`, `Progress`) 검증 화면
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
              onChange={(event) => setSize(event.target.value as ProgressCircleSize)}
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
            <span>Color</span>
            <select
              value={color}
              onChange={(event) => setColor(event.target.value as ProgressCircleColor)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
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
            <span>Interaction State</span>
            <select
              value={interactionState}
              onChange={(event) => setInteractionState(event.target.value as ProgressCircleInteractionState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
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
            <span>Progress: {Math.round(progressValue)}%</span>
            <input
              type="range"
              min={PROGRESS_MIN}
              max={PROGRESS_MAX}
              step={spacing.scale['1']}
              value={progressValue}
              onChange={(event) => setProgressValue(Number(event.target.value))}
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
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Show Label</span>
            <input type="checkbox" checked={showLabel} onChange={(event) => setShowLabel(event.target.checked)} />
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
            gap: spacing.scale['20'],
            justifyItems: 'center',
          }}
        >
          <h2
            style={{
              justifySelf: 'start',
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

          <ProgressCircle
            size={size}
            color={color}
            interactionState={interactionState}
            progressValue={progressValue}
            showLabel={showLabel}
          />
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
            Size Matrix
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(4, minmax(${spacing.scale['120']}, 1fr))`,
              gap: spacing.scale['16'],
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {SIZES.map((item) => (
              <div key={item} style={{ display: 'grid', gap: spacing.scale['8'], justifyItems: 'center' }}>
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
                  {item.toUpperCase()}
                </span>
                <ProgressCircle
                  size={item}
                  color={color}
                  interactionState={interactionState}
                  progressValue={progressValue}
                  showLabel={showLabel}
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

