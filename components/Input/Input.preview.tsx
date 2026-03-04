import React, { useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Input } from './Input';
import type { InputSize, InputTarget, InputType, InputVisualState } from './Input.types';

const TYPES: InputType[] = ['default', 'external', 'button'];
const SIZES: InputSize[] = ['md', 'xs'];
const TARGETS: InputTarget[] = ['default', 'destructive'];
const STATES: Array<'auto' | InputVisualState> = ['auto', 'default', 'hover', 'focus', 'filled', 'disabled'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function InputPreviewPage() {
  const [type, setType] = useState<InputType>('default');
  const [size, setSize] = useState<InputSize>('md');
  const [target, setTarget] = useState<InputTarget>('default');
  const [state, setState] = useState<'auto' | InputVisualState>('auto');
  const [value, setValue] = useState('');
  const [showFlag, setShowFlag] = useState(true);
  const [showLeadDropdown, setShowLeadDropdown] = useState(true);
  const [showLeadIcon, setShowLeadIcon] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showTailIcon, setShowTailIcon] = useState(true);
  const [showTailDropdown, setShowTailDropdown] = useState(true);

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
            Input Preview
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
            Figma 축(Type, Size, Target, State)과 보조 요소(Flag/Dropdown/Icon/Badge) 조합 검증
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
            <span>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as InputType)}
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
              onChange={(event) => setSize(event.target.value as InputSize)}
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
            <span>Target</span>
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value as InputTarget)}
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
              {TARGETS.map((item) => (
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
              onChange={(event) => setState(event.target.value as 'auto' | InputVisualState)}
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

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Value</span>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Filled text"
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
            />
          </label>

          {[
            ['Flag', showFlag, setShowFlag],
            ['Lead Dropdown', showLeadDropdown, setShowLeadDropdown],
            ['Lead Icon', showLeadIcon, setShowLeadIcon],
            ['Badge', showBadge, setShowBadge],
            ['Tail Icon', showTailIcon, setShowTailIcon],
            ['Tail Dropdown', showTailDropdown, setShowTailDropdown],
          ].map(([labelText, checked, setChecked]) => (
            <label
              key={labelText}
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
              <span>{labelText}</span>
              <input
                type="checkbox"
                checked={checked as boolean}
                onChange={(event) => (setChecked as (value: boolean) => void)(event.target.checked)}
              />
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
            Interactive
          </h2>

          <Input
            type={type}
            size={size}
            target={target}
            state={state === 'auto' ? undefined : state}
            value={value}
            onValueChange={setValue}
            showFlag={showFlag}
            showLeadDropdown={showLeadDropdown}
            showLeadIcon={showLeadIcon}
            showBadge={showBadge}
            showTailIcon={showTailIcon}
            showTailDropdown={showTailDropdown}
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

          <div style={{ display: 'grid', gap: spacing.scale['16'] }}>
            {TARGETS.map((matrixTarget) => (
              <div key={matrixTarget} style={{ display: 'grid', gap: spacing.scale['12'] }}>
                <h3
                  style={{
                    margin: spacing.scale['0'],
                    color: textBase.staticDarkSecondary,
                    fontFamily: typography.scale.bodyS.medium.fontFamily,
                    fontSize: typography.scale.bodyS.medium.fontSize,
                    fontWeight: typography.scale.bodyS.medium.fontWeight,
                    lineHeight: `${typography.scale.bodyS.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.bodyS.medium.letterSpacing}px`,
                  }}
                >
                  Target: {toTitle(matrixTarget)}
                </h3>

                <div style={{ display: 'grid', gap: spacing.scale['12'] }}>
                  {SIZES.map((matrixSize) => (
                    <div key={matrixSize} style={{ display: 'grid', gap: spacing.scale['8'] }}>
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
                        Size: {matrixSize.toUpperCase()}
                      </span>

                      <div style={{ display: 'grid', gap: spacing.scale['12'] }}>
                        {TYPES.map((matrixType) => (
                          <Input
                            key={`${matrixTarget}-${matrixSize}-${matrixType}`}
                            type={matrixType}
                            size={matrixSize}
                            target={matrixTarget}
                            state={state === 'auto' ? undefined : state}
                            value={value}
                            showFlag={showFlag}
                            showLeadDropdown={showLeadDropdown}
                            showLeadIcon={showLeadIcon}
                            showBadge={showBadge}
                            showTailIcon={showTailIcon}
                            showTailDropdown={showTailDropdown}
                          />
                        ))}
                      </div>
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
