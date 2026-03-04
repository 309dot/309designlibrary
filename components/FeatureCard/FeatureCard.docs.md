# Feature Card

## Purpose
`FeatureCard`는 Figma `Feature Card` 컴포넌트(`Type=Elevated|Flat|Custom`, `Alignment=Image first|Content first`)를 React + TypeScript로 구현한 카드입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.13`
- `colors.primitive.palette.green.2`
- `colors.primitive.palette.green.11`
- `colors.primitive.palette.purple.2`
- `colors.primitive.palette.purple.8`
- `colors.primitive.palette.purple.11`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.gradients.solid.04`

### Typography
- `typography.scale.h6.semiBold`
- `typography.scale.h6.medium`
- `typography.scale.bodyS.regular`
- `typography.scale.captionL.medium`

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.20`
- `spacing.scale.24`
- `spacing.scale.288`
- `spacing.scale.320`
- `spacing.scale.360`
- `spacing.primitive.4`
- `spacing.primitive.256`

### Radius / Border / Shadow
- `radius.scale.0`
- `radius.scale.lg`
- `radius.scale.xl`
- `radius.scale.xxl`
- `radius.scale.full`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`

## Variants
- `type`: `elevated | flat | custom`
- `alignment`: `imageFirst | contentFirst` (`type=custom`에서는 레이아웃 축 미사용)

## Behavior
- `elevated`
  - 카드 외곽 보더 + radius + shadow 적용
- `flat`
  - 이미지/컨텐츠 블록이 분리되고 간격(`24`) 유지
- `custom`
  - 본문 대신 단일 슬롯 영역 렌더링

## Accessibility Notes
- 루트는 `<article>`로 렌더링됩니다.
- 액션은 네이티브 `<button type="button">` 사용합니다.

## Usage Examples
```tsx
import { FeatureCard } from './FeatureCard';

export function Example() {
  return (
    <>
      <FeatureCard type="elevated" alignment="imageFirst" />

      <FeatureCard
        type="flat"
        alignment="contentFirst"
        headline="New feature rollout"
        description="Ship faster with a reusable design foundation."
      />

      <FeatureCard
        type="custom"
        customSlot={<div style={{ width: '100%', minHeight: 280 }}>Custom content</div>}
      />
    </>
  );
}
```
