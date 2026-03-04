# Radio

## Purpose
`Radio`는 Figma `Radio` 컴포넌트(`Size`, `Active`, `State`)를 기준으로 구현한 단일 선택 입력 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.purple.8`

### Spacing / Size
- `spacing.scale.0`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.16`
- `spacing.scale.20`

### Radius / Border / Shadow
- `radius.scale.full`
- `border.width.0`
- `border.width.1`
- `border.width.2`
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`

## Variants
- `size`: `sm | md`
- `checked`: `boolean`
- `state`: `default | hover | focus | disabled`

## Behavior
- `state` prop이 지정되면 해당 상태를 강제합니다.
- `state`가 없으면 `hover`, `focus` 인터랙션으로 상태를 계산합니다.
- `disabled` 또는 `state=disabled`면 상호작용이 비활성화됩니다.
- 클릭 시 선택되지 않은 경우에만 `onCheckedChange(true)`를 호출합니다.

## Accessibility Notes
- 네이티브 `<button>` + `role="radio"` 사용
- `aria-checked`, `aria-label`, `disabled` 제공
- 포커스 가능 상태에서 키보드 기본 동작(Enter/Space)을 지원

## Usage Examples
```tsx
import { Radio } from './Radio';

export function Example() {
  return (
    <>
      <Radio size="sm" checked={false} />
      <Radio size="md" checked />
      <Radio size="md" checked state="focus" />
      <Radio size="sm" checked={false} state="disabled" />
    </>
  );
}
```
