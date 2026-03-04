import React, { useMemo, useState } from 'react';

import { border, colors, radius, spacing, typography } from '../../style-tokens';

import { FeatureCard } from './FeatureCard';
import type { FeatureCardAlignment, FeatureCardType } from './FeatureCard.types';

const TYPES: FeatureCardType[] = ['elevated', 'flat', 'custom'];
const ALIGNMENTS: FeatureCardAlignment[] = ['imageFirst', 'contentFirst'];

function toTitleCase(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

const palette = colors.primitive.palette;
const textTokens = colors.semantic.theme.text.base;

function PreviewCustomSlot() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: spacing.scale['320'] - spacing.scale['40'],
        display: 'grid',
        placeItems: 'center',
        borderStyle: 'dashed',
        borderWidth: border.width['1'],
        borderColor: palette.purple['8'],
        borderRadius: radius.scale.xl,
        backgroundColor: palette.purple['2'],
        color: palette.purple['11'],
        ...{
          fontFamily: typography.scale.h6.medium.fontFamily,
          fontSize: typography.scale.h6.medium.fontSize,
          fontWeight: typography.scale.h6.medium.fontWeight,
          lineHeight: `${typography.scale.h6.medium.lineHeight}px`,
          letterSpacing: `${typography.scale.h6.medium.letterSpacing}px`,
        },
      }}
    >
      Custom Slot
    </div>
  );
}

export default function FeatureCardPreviewPage() {
  const [type, setType] = useState<FeatureCardType>('elevated');
  const [alignment, setAlignment] = useState<FeatureCardAlignment>('imageFirst');
  const [showBadge, setShowBadge] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const disabledImage = type === 'custom';
  const disabledAlignment = type === 'custom';

  const imageSlot = useMemo(() => {
    if (disabledImage || !showImage) {
      return null;
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: palette.base.transparent,
        }}
      />
    );
  }, [disabledImage, showImage]);

  return (
    <main
      style={{
        minHeight: spacing.scale['844'],
        backgroundColor: palette.base.white,
        color: textTokens.staticDark,
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
            Feature Card Preview
          </h1>
          <p
            style={{
              margin: spacing.scale['0'],
              color: textTokens.staticDarkSecondary,
              fontFamily: typography.scale.bodyS.regular.fontFamily,
              fontSize: typography.scale.bodyS.regular.fontSize,
              fontWeight: typography.scale.bodyS.regular.fontWeight,
              lineHeight: `${typography.scale.bodyS.regular.lineHeight}px`,
              letterSpacing: `${typography.scale.bodyS.regular.letterSpacing}px`,
            }}
          >
            Figma variant(Type/Alignment)과 슬롯 기반 Custom 타입을 포함한 카드 검증 화면
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
              onChange={(event) => setType(event.target.value as FeatureCardType)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: palette.base.white,
                color: textTokens.staticDark,
              }}
            >
              {TYPES.map((item) => (
                <option key={item} value={item}>
                  {toTitleCase(item)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: spacing.scale['4'] }}>
            <span>Alignment</span>
            <select
              value={alignment}
              disabled={disabledAlignment}
              onChange={(event) => setAlignment(event.target.value as FeatureCardAlignment)}
              style={{
                minHeight: spacing.scale['40'],
                borderStyle: 'solid',
                borderWidth: border.width['1'],
                borderColor: palette.gray['3'],
                borderRadius: radius.scale.md,
                paddingInline: spacing.scale['12'],
                backgroundColor: disabledAlignment ? palette.gray['2'] : palette.base.white,
                color: textTokens.staticDark,
              }}
            >
              {ALIGNMENTS.map((item) => (
                <option key={item} value={item}>
                  {toTitleCase(item)}
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
            <span>Badge</span>
            <input type="checkbox" checked={showBadge} onChange={(event) => setShowBadge(event.target.checked)} />
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
            <span>Actions</span>
            <input type="checkbox" checked={showActions} onChange={(event) => setShowActions(event.target.checked)} />
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
              backgroundColor: disabledImage ? palette.gray['2'] : palette.base.white,
            }}
          >
            <span>Image</span>
            <input
              type="checkbox"
              checked={showImage}
              disabled={disabledImage}
              onChange={(event) => setShowImage(event.target.checked)}
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

          <FeatureCard
            type={type}
            alignment={alignment}
            showBadge={showBadge}
            showActions={showActions}
            imageSlot={imageSlot}
            customSlot={type === 'custom' ? <PreviewCustomSlot /> : undefined}
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

          <div style={{ display: 'grid', gap: spacing.scale['24'] }}>
            {TYPES.map((typeItem) => (
              <div key={typeItem} style={{ display: 'grid', gap: spacing.scale['12'] }}>
                <span
                  style={{
                    color: textTokens.staticDarkSecondary,
                    fontFamily: typography.scale.captionL.medium.fontFamily,
                    fontSize: typography.scale.captionL.medium.fontSize,
                    fontWeight: typography.scale.captionL.medium.fontWeight,
                    lineHeight: `${typography.scale.captionL.medium.lineHeight}px`,
                    letterSpacing: `${typography.scale.captionL.medium.letterSpacing}px`,
                  }}
                >
                  Type {toTitleCase(typeItem)}
                </span>

                {typeItem === 'custom' ? (
                  <FeatureCard type="custom" customSlot={<PreviewCustomSlot />} />
                ) : (
                  ALIGNMENTS.map((alignmentItem) => (
                    <FeatureCard
                      key={`${typeItem}-${alignmentItem}`}
                      type={typeItem}
                      alignment={alignmentItem}
                      showBadge
                      showActions
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
