import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { Accordion } from './Accordion';
import type { AccordionSize, AccordionVisualState } from './Accordion.types';

const SIZES: AccordionSize[] = ['lg', 'md'];
const VISUAL_STATES: Array<'default' | AccordionVisualState> = ['default', 'hover', 'focused', 'disabled'];

function toTitle(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function PreviewSlot() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: spacing.scale['288'],
        borderStyle: 'dashed',
        borderWidth: border.width['1'],
        borderColor: border.color.theme.action.focus,
        borderRadius: radius.scale.xl,
        backgroundColor: colors.primitive.palette.purple['2'],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primitive.palette.purple['11'],
        fontFamily: typography.scale.h6.medium.fontFamily,
        fontSize: typography.scale.h6.medium.fontSize,
        fontWeight: typography.scale.h6.medium.fontWeight,
        lineHeight: `${typography.scale.h6.medium.lineHeight}px`,
        letterSpacing: `${typography.scale.h6.medium.letterSpacing}px`,
      }}
    >
      Slot
    </div>
  );
}

export default function AccordionPreviewPage() {
  const [size, setSize] = useState<AccordionSize>('lg');
  const [state, setState] = useState<'default' | AccordionVisualState>('default');
  const [expanded, setExpanded] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [showLeadingIcon, setShowLeadingIcon] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showSlot, setShowSlot] = useState(true);

  const forceState = useMemo(() => (state === 'default' ? undefined : state), [state]);

  return (
    <main
      style={{
        minHeight: '100vh',
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
              margin: 0,
              fontFamily: typography.scale.h3.bold.fontFamily,
              fontSize: typography.scale.h3.bold.fontSize,
              fontWeight: typography.scale.h3.bold.fontWeight,
              lineHeight: `${typography.scale.h3.bold.lineHeight}px`,
              letterSpacing: `${typography.scale.h3.bold.letterSpacing}px`,
            }}
          >
            Accordion Preview
          </h1>
          <p
            style={{
              margin: 0,
              color: colors.semantic.theme.text.base.staticDarkSecondary,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma MCP variant(`size`, `expanded`, `state`) 기반 인터랙션 검증 페이지
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${spacing.scale['224']}px, 1fr))`,
            gap: spacing.scale['12'],
          }}
        >
          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>Size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as AccordionSize)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
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
            <span style={{ color: colors.semantic.theme.text.base.staticDarkSecondary }}>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value as 'default' | AccordionVisualState)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: spacing.scale['1'],
                borderColor: colors.primitive.palette.gray['3'],
                backgroundColor: colors.primitive.palette.base.white,
                color: colors.semantic.theme.text.base.staticDark,
                paddingInline: spacing.scale['12'],
                borderRadius: spacing.scale['8'],
              }}
            >
              {VISUAL_STATES.map((item) => (
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
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Expanded</span>
            <input type="checkbox" checked={expanded} onChange={(event) => setExpanded(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Disabled</span>
            <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Leading Icon</span>
            <input type="checkbox" checked={showLeadingIcon} onChange={(event) => setShowLeadingIcon(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Description</span>
            <input type="checkbox" checked={showDescription} onChange={(event) => setShowDescription(event.target.checked)} />
          </label>

          <label
            style={{
              minHeight: spacing.scale['40'],
              borderStyle: 'solid',
              borderWidth: spacing.scale['1'],
              borderColor: colors.primitive.palette.gray['3'],
              borderRadius: spacing.scale['8'],
              paddingInline: spacing.scale['12'],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing.scale['8'],
              backgroundColor: colors.primitive.palette.base.white,
            }}
          >
            <span>Slot</span>
            <input type="checkbox" checked={showSlot} onChange={(event) => setShowSlot(event.target.checked)} />
          </label>
        </div>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.primitive.palette.gray['1'],
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Active Selection
          </h2>

          <div style={{ width: spacing.scale['400'] }}>
            <Accordion
              title="Headline text"
              description={showDescription ? 'Description' : undefined}
              size={size}
              expanded={expanded}
              disabled={disabled}
              forceState={forceState}
              showLeadingIcon={showLeadingIcon}
            >
              {showSlot ? <PreviewSlot /> : null}
            </Accordion>
          </div>
        </section>

        <section
          style={{
            borderStyle: 'solid',
            borderWidth: spacing.scale['1'],
            borderColor: colors.primitive.palette.gray['3'],
            borderRadius: spacing.scale['12'],
            padding: spacing.scale['24'],
            display: 'grid',
            gap: spacing.scale['16'],
            backgroundColor: colors.primitive.palette.gray['1'],
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: typography.scale.h5.semiBold.fontFamily,
              fontSize: typography.scale.h5.semiBold.fontSize,
              fontWeight: typography.scale.h5.semiBold.fontWeight,
              lineHeight: `${typography.scale.h5.semiBold.lineHeight}px`,
              letterSpacing: `${typography.scale.h5.semiBold.letterSpacing}px`,
            }}
          >
            Variant Matrix
          </h2>

          <div style={{ display: 'grid', gap: spacing.scale['20'] }}>
            {SIZES.map((sizeItem) => (
              <div key={sizeItem} style={{ display: 'grid', gap: spacing.scale['12'] }}>
                <span
                  style={{
                    color: colors.semantic.theme.text.base.staticDarkSecondary,
                    fontSize: typography.scale.captionM.medium.fontSize,
                    fontWeight: typography.scale.captionM.medium.fontWeight,
                    lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                  }}
                >
                  Size {sizeItem.toUpperCase()}
                </span>

                {VISUAL_STATES.map((stateItem) => {
                  const stateDisabled = stateItem === 'disabled';
                  const mappedState = stateItem === 'default' || stateDisabled ? undefined : stateItem;

                  return (
                    <div key={`${sizeItem}-${stateItem}`} style={{ display: 'grid', gap: spacing.scale['8'] }}>
                      <span
                        style={{
                          color: colors.semantic.theme.text.base.staticDarkSecondary,
                          fontSize: typography.scale.captionM.medium.fontSize,
                          fontWeight: typography.scale.captionM.medium.fontWeight,
                          lineHeight: `${typography.scale.captionM.medium.lineHeight}px`,
                          letterSpacing: `${typography.scale.captionM.medium.letterSpacing}px`,
                        }}
                      >
                        {toTitle(stateItem)}
                      </span>

                      <div style={{ display: 'grid', gap: spacing.scale['8'] }}>
                        <div style={{ width: spacing.scale['400'] }}>
                          <Accordion
                            title="Headline text"
                            size={sizeItem}
                            expanded={false}
                            disabled={stateDisabled}
                            forceState={mappedState}
                            description="Description"
                          />
                        </div>

                        <div style={{ width: spacing.scale['400'] }}>
                          <Accordion
                            title="Headline text"
                            size={sizeItem}
                            expanded
                            disabled={stateDisabled}
                            forceState={mappedState}
                            description="Description"
                          >
                            <PreviewSlot />
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

