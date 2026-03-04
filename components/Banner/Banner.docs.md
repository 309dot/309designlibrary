# Banner

## Purpose
`Banner`는 Figma `Banner` 컴포넌트(`Direction=Horizontal|Vertical`, `State=Default|Hover`)를 React + TypeScript로 구현한 프로모션/안내 영역 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.green.1`
- `colors.primitive.palette.green.2`
- `colors.primitive.palette.green.11`
- `colors.primitive.palette.gray.2a`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

### Typography
- `typography.scale.h6.semiBold`
- `typography.scale.bodyS.regular`
- `typography.scale.captionL.medium`

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.24`
- `spacing.scale.288`
- `spacing.scale.320`
- `spacing.scale.640`
- `spacing.primitive.256`
- `spacing.primitive.5`

### Radius / Border
- `radius.scale.xl`
- `radius.scale.full`
- `border.width.1`

## Variants
- `direction`: `horizontal | vertical`
- `state`: `default | hover`

## Behavior
- `state=hover`에서 배경색이 `green.1`로 전환됩니다.
- `state` 미지정 + `interactive=true`일 때 마우스 hover로 상태가 전환됩니다.
- `direction`에 따라 레이아웃이 수평/수직으로 변경됩니다.

## Accessibility Notes
- 루트는 `<article>`입니다.
- 배너 내 장식 이미지는 `alt=""` + `aria-hidden`으로 처리합니다.
- Figma 정의상 `focus`, `disabled` variant는 제공되지 않아 별도 스타일은 구현하지 않았습니다.

## Usage Examples
```tsx
import { Banner } from './Banner';

export function Example() {
  return (
    <>
      <Banner direction="horizontal" state="default" />
      <Banner direction="horizontal" state="hover" />
      <Banner direction="vertical" state="default" />
      <Banner direction="vertical" state="hover" />
    </>
  );
}
```
