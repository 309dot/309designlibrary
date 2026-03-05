import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { ProgressBar } from './ProgressBar';
import type {
  ProgressBarColor,
  ProgressBarDirection,
  ProgressBarInteractionState,
  ProgressBarSize,
  ProgressBarTarget,
} from './ProgressBar.types';

const DIRECTIONS: ProgressBarDirection[] = ['vertical', 'horizontal'];
const TARGETS: ProgressBarTarget[] = ['default', 'destructive'];
const SIZES: ProgressBarSize[] = ['sm', 'md', 'lg'];
const COLORS: ProgressBarColor[] = ['green', 'blue', 'red', 'orange', 'purple'];
const INTERACTION_STATES: ProgressBarInteractionState[] = ['default', 'hover', 'focus', 'disabled'];

const PROGRESS_MIN = spacing.scale['0'];
const PROGRESS_MAX = spacing.scale['10'] * spacing.scale['10'];
const PROGRESS_STEP = spacing.scale['2'];
const PROGRESS_DEFAULT = PROGRESS_MAX / spacing.scale['2'];

function toTitle(value: string): string {
  return value.replace(/^./, (char) => char.toUpperCase());
}

export default function ProgressBarPreviewPage() {
  const [direction, setDirection] = useState<ProgressBarDirection>('vertical');
  const [target, setTarget] = useState<ProgressBarTarget>('default');
  const [size, setSize] = useState<ProgressBarSize>('md');
  const [color, setColor] = useState<ProgressBarColor>('green');
  const [interactionState, setInteractionState] = useState<ProgressBarInteractionState>('default');
  const [progressValue, setProgressValue] = useState<number>(PROGRESS_DEFAULT);
  const [showLabel, setShowLabel] = useState(true);
  const [showOptionalLabel, setShowOptionalLabel] = useState(true);
  const [showProgressState, setShowProgressState] = useState(true);
  const [showTailIcon, setShowTailIcon] = useState(true);
  const [showHelper, setShowHelper] = useState(true);
  const [shimmering, setShimmering] = useState(false);

  const computedColor = useMemo<ProgressBarColor>(() => {
    if (target === 'destructive') {
      return 'red';
    }

    return color;
  }, [color, target]);

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
            Progress Bar Preview
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
            Figma Variant(`Direction`, `Target`) 기준 프리뷰와 Line 확장 축(`Size`, `Color`, `Shimmering`) 검증 화면
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
            <span>Direction</span>
            <select
              value={direction}
              onChange={(event) => setDirection(event.target.value as ProgressBarDirection)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            >
              {DIRECTIONS.map((item) => (
                <option key={item} value={item}>
                  {toTitle(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Target</span>
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value as ProgressBarTarget)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
              }}
            >
              {TARGETS.map((item) => (
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
              onChange={(event) => setSize(event.target.value as ProgressBarSize)}
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
              value={computedColor}
              disabled={target === 'destructive'}
              onChange={(event) => setColor(event.target.value as ProgressBarColor)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: colors.primitive.palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: target === 'destructive' ? colors.primitive.palette.gray['2'] : colors.primitive.palette.base.white,
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
              onChange={(event) => setInteractionState(event.target.value as ProgressBarInteractionState)}
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
              step={PROGRESS_STEP}
              value={progressValue}
              onChange={(event) => setProgressValue(Number(event.target.value))}
            />
          </label>

          {[
            ['Label', showLabel, setShowLabel],
            ['Optional', showOptionalLabel, setShowOptionalLabel],
            ['State Text', showProgressState, setShowProgressState],
            ['Tail Icon', showTailIcon, setShowTailIcon],
            ['Helper', showHelper, setShowHelper],
            ['Shimmering', shimmering, setShimmering],
          ].map(([labelText, checked, setChecked]) => (
            <label
              key={labelText}
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
              <span>{labelText}</span>
              <input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setChecked as (value: boolean) => void)(event.target.checked)} />
            </label>
          ))}
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

          <ProgressBar
            direction={direction}
            target={target}
            size={size}
            color={computedColor}
            interactionState={interactionState}
            progressValue={progressValue}
            showLabel={showLabel}
            showOptionalLabel={showOptionalLabel}
            showProgressState={showProgressState}
            showTailIcon={showTailIcon}
            showHelper={showHelper}
            shimmering={shimmering}
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
            Figma Variant Matrix
          </h2>

          {DIRECTIONS.map((dir) => (
            <div key={dir} style={{ display: 'grid', gap: spacing.scale['8'] }}>
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
                {toTitle(dir)}
              </span>

              {TARGETS.map((tar) => (
                <ProgressBar
                  key={`${dir}-${tar}`}
                  direction={dir}
                  target={tar}
                  size="md"
                  color={tar === 'destructive' ? 'red' : 'green'}
                  progressValue={progressValue}
                  showProgressState={tar === 'default'}
                  showTailIcon={tar === 'default'}
                  showHelper={dir === 'vertical'}
                  interactionState={interactionState}
                />
              ))}
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
