# Checkbox

## Purpose
`Checkbox`는 Figma `Checkbox` 컴포넌트(`Size`, `Type`, `State`, `Checked`)를 기준으로 구현한 체크 입력 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.purple.8`
- `colors.semantic.theme.text.base.staticWhite`

### Spacing / Size
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.16`
- `spacing.scale.20`

### Radius / Border / Shadow
- `radius.scale.xs`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`

## Variants
- `size`: `sm | md`
- `type`: `default | indeterminate`
- `state`: `default | hover | focus | disabled`
- `checked`: `boolean` (`type=default`에서 사용)

## Behavior
- `type=default`에서는 클릭 시 체크 토글
- `type=indeterminate`에서는 mixed 상태(`aria-checked="mixed"`) 유지
- `state` prop이 주어지면 강제 상태, 없으면 hover/focus 상호작용으로 상태 반영
- `disabled` 또는 `state=disabled`면 상호작용 비활성화

## Accessibility Notes
- 네이티브 `<button>` + `role="checkbox"` 사용
- `aria-checked`를 `true | false | mixed`로 제공
- `disabled` 속성 사용으로 키보드/포인터 상호작용 차단

## Usage Examples
```tsx
import { Checkbox } from './Checkbox';

export function Example() {
  return (
    <>
      <Checkbox size="sm" type="default" checked={false} />
      <Checkbox size="md" type="default" checked />
      <Checkbox size="md" type="indeterminate" />
      <Checkbox size="sm" type="default" state="focus" checked />
    </>
  );
}
```
