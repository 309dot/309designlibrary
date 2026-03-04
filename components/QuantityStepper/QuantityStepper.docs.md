# Quantity Stepper

## Purpose
`QuantityStepper`는 Figma `Quantity Stepper` 컴포넌트(`Size=lg|md`, `Shape=Rounded|Pill`, `State=Default|Hover|Focused`)를 React + TypeScript로 구현한 수량 증감 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.1a`
- `colors.primitive.palette.gray.2a`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `border.color.theme.action.focusLight`

### Typography
- `typography.scale.captionL.medium`

### Spacing / Sizing
- `spacing.scale.0`
- `spacing.scale.1`
- `spacing.scale.2`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.28`
- `spacing.scale.32`
- `spacing.scale.40`
- `spacing.primitive.999`

### Radius / Shadow / Border
- `radius.scale.full`
- `radius.scale.lg`
- `radius.scale.xl`
- `border.width.0`
- `border.width.1`
- `shadows.focusRing.light.css`

## Variants
- `size`: `lg | md`
- `shape`: `rounded | pill`
- `state`: `default | hover | focused | disabled`

## Behavior
- `+` 버튼 클릭 시 `step`만큼 증가, `-` 버튼 클릭 시 `step`만큼 감소합니다.
- 값은 `min`~`max` 범위로 clamp됩니다.
- `value` prop이 있으면 controlled, 없으면 `defaultValue` 기반 uncontrolled로 동작합니다.
- 키보드:
  - `ArrowUp`, `ArrowRight`: 증가
  - `ArrowDown`, `ArrowLeft`: 감소
- 포커스 상태에서 Figma와 동일하게 보더 + 포커스 링을 표시합니다.

## Accessibility Notes
- 루트에 `role="spinbutton"` + `aria-valuenow/min/max`를 제공합니다.
- 증감 버튼은 각각 `aria-label`(`Decrease quantity`, `Increase quantity`)을 가집니다.
- 비활성 상태는 `aria-disabled`와 버튼 `disabled`를 함께 적용합니다.

## Usage Examples
```tsx
import { QuantityStepper } from './QuantityStepper';

export function Example() {
  return (
    <>
      <QuantityStepper size="lg" shape="rounded" defaultValue={2} />

      <QuantityStepper
        size="md"
        shape="pill"
        value={4}
        min={1}
        max={10}
        step={1}
        onValueChange={(value) => console.log(value)}
      />

      <QuantityStepper size="lg" shape="rounded" state="focused" />
    </>
  );
}
```
