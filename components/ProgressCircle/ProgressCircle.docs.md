# Progress Circle

## Purpose
`ProgressCircle`는 Figma `Progress Circle` 컴포넌트(`Size=xs|sm|md|lg`)를 React + TypeScript로 구현한 원형 진행 상태 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.green.8`
- `colors.primitive.palette.purple.8`
- `colors.primitive.palette.red.8`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkQuaternary`

### Typography
- `typography.scale.captionL.medium`

### Spacing / Sizing
- `spacing.scale.0`
- `spacing.scale.1`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.16`
- `spacing.scale.32`
- `spacing.scale.64`
- `spacing.scale.96`
- `spacing.scale.120`
- `spacing.scale.160`
- `spacing.scale.100` (derived: `spacing.scale.10 * spacing.scale.10`)

### Shadow
- `shadows.focusRing.light.css`

## Variants
- Figma Top-level
  - `size`: `xs | sm | md | lg`
- Nested Circle 확장 축(컴포넌트 prop으로 반영)
  - `color`: `green | purple | red`
  - `progressValue`: `0..100`
- 공통 상태
  - `interactionState`: `default | hover | focus | disabled`

## Behavior
- `progressValue`에 따라 원형 stroke의 `dashoffset`이 변경됩니다.
- `size=xs`는 기본적으로 중앙 텍스트를 숨기고, `sm|md|lg`는 표시합니다.
- `progressValue=0`일 때는 end-cap 도트가 보이지 않도록 `strokeLinecap='butt'`를 적용합니다.

## Accessibility Notes
- 루트에 `role="progressbar"` + `aria-valuemin/max/now`를 제공합니다.
- `interactionState=focus`에서 포커스 링 토큰을 적용합니다.
- `interactionState=disabled`에서 fill/text 대비를 낮춥니다.

## Usage Examples
```tsx
import { ProgressCircle } from './ProgressCircle';

export function Example() {
  return (
    <>
      <ProgressCircle size="xs" progressValue={50} />

      <ProgressCircle
        size="md"
        color="green"
        progressValue={75}
        label="75%"
      />

      <ProgressCircle
        size="lg"
        color="purple"
        progressValue={100}
        interactionState="focus"
      />
    </>
  );
}
```

