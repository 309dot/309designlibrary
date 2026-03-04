import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { SelectInput } from './SelectInput';
import type {
  SelectInputSize,
  SelectInputTarget,
  SelectInputType,
  SelectInputVisualState,
} from './SelectInput.types';

const TYPES: SelectInputType[] = ['default', 'multi-select', 'avatar'];
const SIZES: SelectInputSize[] = ['md', 'sm'];
const TARGETS: SelectInputTarget[] = ['default', 'destructive'];
const STATES: Array<'auto' | SelectInputVisualState> = ['auto', 'default', 'hover', 'filled', 'focus', 'disabled'];

const MATRIX_STATES_BY_TARGET: Record<SelectInputTarget, SelectInputVisualState[]> = {
  default: ['default', 'hover', 'filled', 'focus', 'disabled'],
  destructive: ['default', 'hover', 'filled', 'focus'],
};

const PRESET_SELECTED_ID = 'option-2';
const PRESET_MULTI_SELECTED_IDS = ['option-2', 'option-3', 'option-6', 'option-1', 'option-7'];

const palette = colors.primitive.palette;
const textBase = colors.semantic.theme.text.base;

function toTitle(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function SelectInputPreviewPage() {
  const [type, setType] = useState<SelectInputType>('default');
  const [size, setSize] = useState<SelectInputSize>('md');
  const [target, setTarget] = useState<SelectInputTarget>('default');
  const [state, setState] = useState<'auto' | SelectInputVisualState>('auto');
  const [showLabel, setShowLabel] = useState(true);
  const [showHelper, setShowHelper] = useState(true);
  const [showShortcutBadge, setShowShortcutBadge] = useState(true);
  const [showLeadIcon, setShowLeadIcon] = useState(true);
  const [showTailIcon, setShowTailIcon] = useState(true);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const effectiveSingleSelectedId = useMemo(() => {
    if (type === 'multi-select') {
      return undefined;
    }

    if (selectedId) {
      return selectedId;
    }

    if (state === 'filled' || state === 'focus') {
      return PRESET_SELECTED_ID;
    }

    return undefined;
  }, [selectedId, state, type]);

  const effectiveMultiSelectedIds = useMemo(() => {
    if (type !== 'multi-select') {
      return [];
    }

    if (selectedIds.length > 0) {
      return selectedIds;
    }

    if (state === 'filled' || state === 'focus') {
      return PRESET_MULTI_SELECTED_IDS;
    }

    return [];
  }, [selectedIds, state, type]);

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
            Select Input Preview
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
            Figma Variant 축(Size, Target, Type, State)과 interaction 상태를 검증합니다.
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
              onChange={(event) => setType(event.target.value as SelectInputType)}
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
              onChange={(event) => setSize(event.target.value as SelectInputSize)}
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
              onChange={(event) => setTarget(event.target.value as SelectInputTarget)}
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
              onChange={(event) => setState(event.target.value as 'auto' | SelectInputVisualState)}
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

          {[
            ['Label', showLabel, setShowLabel],
            ['Helper', showHelper, setShowHelper],
            ['Shortcut Badge', showShortcutBadge, setShowShortcutBadge],
            ['Lead Icon', showLeadIcon, setShowLeadIcon],
            ['Tail Icon', showTailIcon, setShowTailIcon],
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

          <SelectInput
            type={type}
            size={size}
            target={target}
            state={state === 'auto' ? undefined : state}
            showLabel={showLabel}
            showHelper={showHelper}
            showShortcutBadge={showShortcutBadge}
            showLeadIcon={showLeadIcon}
            showTailIcon={showTailIcon}
            selectedId={effectiveSingleSelectedId}
            selectedIds={effectiveMultiSelectedIds}
            onSelectedIdChange={setSelectedId}
            onSelectedIdsChange={setSelectedIds}
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

                {SIZES.map((matrixSize) => (
                  <div key={`${matrixTarget}-${matrixSize}`} style={{ display: 'grid', gap: spacing.scale['8'] }}>
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
                        <div key={`${matrixTarget}-${matrixSize}-${matrixType}`} style={{ display: 'grid', gap: spacing.scale['8'] }}>
                          <span
                            style={{
                              color: textBase.staticDarkSecondary,
                              ...toTypographyStyle(typography.scale.captionM.medium),
                            }}
                          >
                            Type: {toTitle(matrixType)}
                          </span>

                          {MATRIX_STATES_BY_TARGET[matrixTarget].map((matrixState) => {
                            const selectedValueProps =
                              matrixType === 'multi-select'
                                ? {
                                    selectedIds:
                                      matrixState === 'filled' || matrixState === 'focus' ? PRESET_MULTI_SELECTED_IDS : [],
                                  }
                                : {
                                    selectedId: matrixState === 'filled' || matrixState === 'focus' ? PRESET_SELECTED_ID : undefined,
                                  };

                            return (
                              <SelectInput
                                key={`${matrixTarget}-${matrixSize}-${matrixType}-${matrixState}`}
                                target={matrixTarget}
                                size={matrixSize}
                                type={matrixType}
                                state={matrixState}
                                {...selectedValueProps}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
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

function toTypographyStyle(token: {
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
