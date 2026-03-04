import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Icons } from './Icons';
import {
  ICON_SAMPLE_NAMES,
  ICON_SIZE_OPTIONS,
  ICON_TONE_OPTIONS,
  ICON_TYPE_OPTIONS,
  ICON_VISUAL_STATE_OPTIONS,
} from './Icons.types';
import type { IconSizeToken, IconTone, IconType, IconVisualState } from './Icons.types';

const textBase = colors.semantic.theme.text.base;
const palette = colors.primitive.palette;

function textStyle(token: {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}) {
  return {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    fontWeight: token.fontWeight,
    lineHeight: `${token.lineHeight}px`,
    letterSpacing: `${token.letterSpacing}px`,
  };
}

export default function IconsPreviewPage() {
  const [name, setName] = useState<string>(ICON_SAMPLE_NAMES[0]);
  const [type, setType] = useState<IconType>('line');
  const [size, setSize] = useState<IconSizeToken>('24');
  const [tone, setTone] = useState<IconTone>('primary');
  const [state, setState] = useState<IconVisualState>('default');
  const [interactive, setInteractive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [decorative, setDecorative] = useState(true);

  const gridNames = useMemo(() => ICON_SAMPLE_NAMES.slice(0, spacing.scale['20']), []);

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
        backgroundColor: palette.base.white,
        color: textBase.staticDark,
        padding: spacing.scale['24'],
        display: 'grid',
        gap: spacing.scale['20'],
      }}
    >
      <header style={{ display: 'grid', gap: spacing.scale['8'] }}>
        <h1
          style={{
            margin: spacing.scale['0'],
            ...textStyle(typography.scale.h4.bold),
          }}
        >
          Icons Preview
        </h1>
        <p
          style={{
            margin: spacing.scale['0'],
            color: textBase.staticDarkSecondary,
            ...textStyle(typography.scale.bodyS.regular),
          }}
        >
          Figma MCP 노드 `1403:50643` 기준 아이콘 심볼 네이밍(`*-line`, `*-fill`)과 24px 기본 규격을 컴포넌트로 반영했습니다.
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
          gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['160']}px, 1fr))`,
          gap: spacing.scale['12'],
        }}
      >
        <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
          <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>Name</span>
          <select
            value={name}
            onChange={(event) => setName(event.target.value)}
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
            {ICON_SAMPLE_NAMES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
          <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as IconType)}
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
            {ICON_TYPE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
          <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>Size Token</span>
          <select
            value={size}
            onChange={(event) => setSize(event.target.value as IconSizeToken)}
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
            {ICON_SIZE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
          <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>Tone</span>
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as IconTone)}
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
            {ICON_TONE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
          <span style={{ ...textStyle(typography.scale.captionM.medium), color: textBase.staticDarkSecondary }}>State</span>
          <select
            value={state}
            onChange={(event) => setState(event.target.value as IconVisualState)}
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
            {ICON_VISUAL_STATE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        {[
          ['interactive', interactive, setInteractive],
          ['disabled', disabled, setDisabled],
          ['decorative', decorative, setDecorative],
        ].map(([label, value, setter]) => (
          <label
            key={label}
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: border.width['1'],
              borderColor: palette.gray['3'],
              borderRadius: radius.scale.md,
              backgroundColor: palette.base.white,
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
            }}
          >
            <span style={{ ...textStyle(typography.scale.captionL.regular) }}>{label}</span>
            <input type="checkbox" checked={value as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} />
          </label>
        ))}
      </section>

      <section
        style={{
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: palette.gray['3'],
          borderRadius: radius.scale.xl,
          backgroundColor: palette.gray['1'],
          padding: spacing.scale['20'],
          display: 'grid',
          gap: spacing.scale['16'],
        }}
      >
        <h2
          style={{
            margin: spacing.scale['0'],
            ...textStyle(typography.scale.h6.medium),
          }}
        >
          Active Variant
        </h2>
        <div
          style={{
            minHeight: spacing.scale['192'],
            borderStyle: 'dashed',
            borderWidth: border.width['1'],
            borderColor: colors.semantic.theme.icon.base.staticDarkQuaternary,
            borderRadius: radius.scale.lg,
            backgroundColor: palette.base.white,
            display: 'grid',
            placeItems: 'center',
            gap: spacing.scale['12'],
          }}
        >
          <Icons
            name={name}
            type={type}
            size={size}
            tone={tone}
            state={state}
            interactive={interactive}
            disabled={disabled}
            decorative={decorative}
            ariaLabel={`${name} ${type} icon`}
          />

          <div
            style={{
              display: 'grid',
              gap: spacing.scale['4'],
              textAlign: 'center',
              color: textBase.staticDarkSecondary,
              ...textStyle(typography.scale.captionM.regular),
            }}
          >
            <div>{`class: ri-${name}-${type}`}</div>
            <div>{`state: ${state}`}</div>
            <div>{`size token: spacing.scale.${size}`}</div>
          </div>
        </div>
      </section>

      <section
        style={{
          borderStyle: 'solid',
          borderWidth: border.width['1'],
          borderColor: palette.gray['3'],
          borderRadius: radius.scale.xl,
          backgroundColor: palette.gray['1'],
          padding: spacing.scale['16'],
          display: 'grid',
          gap: spacing.scale['12'],
        }}
      >
        <h2
          style={{
            margin: spacing.scale['0'],
            ...textStyle(typography.scale.h6.medium),
          }}
        >
          Sample Grid (Line / Fill)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${spacing.scale['120']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          {gridNames.map((iconName) => (
            <article
              key={iconName}
              style={{
                borderStyle: 'dashed',
                borderWidth: border.width['1'],
                borderColor: colors.semantic.theme.icon.base.staticDarkQuaternary,
                borderRadius: radius.scale.md,
                backgroundColor: palette.base.white,
                minHeight: spacing.scale['120'],
                padding: spacing.scale['10'],
                display: 'grid',
                alignContent: 'center',
                justifyItems: 'center',
                gap: spacing.scale['8'],
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.scale['12'] }}>
                <Icons name={iconName} type="line" size="24" tone="secondary" />
                <Icons name={iconName} type="fill" size="24" tone="primary" />
              </div>
              <span
                style={{
                  ...textStyle(typography.scale.captionM.regular),
                  color: textBase.staticDarkSecondary,
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {iconName}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
