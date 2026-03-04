# Progress Bar

## Purpose
`ProgressBar`는 Figma `Progress Bar` 컴포넌트(`Direction=Vertical|Horizontal`, `Target=Default|Destructive`)를 React + TypeScript로 구현한 진행 상태 표시 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.base.dark1`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.white.8`
- `colors.primitive.palette.green.8`
- `colors.primitive.palette.blue.8`
- `colors.primitive.palette.red.8`
- `colors.primitive.palette.orange.8`
- `colors.primitive.palette.purple.8`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkTertiary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.status.destructive`

### Typography
- `typography.scale.captionL.medium`
- `typography.scale.captionL.regular`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.24`
- `spacing.scale.40`
- `spacing.scale.50`
- `spacing.scale.100` (derived: `spacing.scale.10 * spacing.scale.10`)
- `spacing.scale.160`
- `spacing.scale.400`

### Radius / Shadow
- `radius.scale.full`
- `shadows.focusRing.light.css`

## Variants
- Figma Top-level
  - `direction`: `vertical | horizontal`
  - `target`: `default | destructive`
- Nested Line 확장 축(컴포넌트 prop으로 반영)
  - `size`: `sm | md | lg`
  - `color`: `green | blue | red | orange | purple`
  - `progressValue`: `0..100`
  - `shimmering`: `true | false`
- 공통 상태
  - `interactionState`: `default | hover | focus | disabled`

## Behavior
- `progressValue`에 따라 Fill 너비가 변경됩니다.
- `target=default`는 기본적으로 진행 텍스트/tail-icon 노출, `destructive`는 최소 구조로 표현됩니다.
- `direction=vertical`에서 helper 행이 기본 노출됩니다.
- `shimmering=true`면 Figma Line의 Schimmering 축을 반영한 오버레이 애니메이션이 적용됩니다.

## Accessibility Notes
- 루트에 `role="progressbar"` 및 `aria-valuemin`, `aria-valuemax`, `aria-valuenow`를 제공합니다.
- 포커스 상태는 `shadows.focusRing.light.css`로 표시합니다.
- 비활성 상태(`interactionState=disabled`)는 텍스트/아이콘 대비를 낮추고 인터랙션을 차단합니다.

## Usage Examples
```tsx
import { ProgressBar } from './ProgressBar';

export function Example() {
  return (
    <>
      <ProgressBar direction="vertical" target="default" progressValue={50} />

      <ProgressBar
        direction="horizontal"
        target="destructive"
        progressValue={80}
        showProgressState={false}
      />

      <ProgressBar
        direction="horizontal"
        target="default"
        size="lg"
        color="purple"
        progressValue={60}
        shimmering
      />
    </>
  );
}
```

