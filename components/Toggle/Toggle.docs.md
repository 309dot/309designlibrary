# Toggle

## Purpose
`Toggle`은 on/off 이진 상태를 즉시 전환하는 스위치 컴포넌트입니다.
구현 기준은 Figma MCP 노드 `593:4174`이며, `Size(sm/md)`, `Active(True/False)`, `State(Default/Hover/Focus/Disabled)` variant를 그대로 반영합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background Tokens
- `colors.semantic.theme.background.toggle.default`
- `colors.semantic.theme.background.toggle.hover`
- `colors.semantic.theme.background.toggle.disabled`
- `colors.semantic.theme.background.toggle.active`
- `colors.semantic.theme.background.toggle.activeHover`
- `colors.semantic.theme.background.toggle.activeDisabled`
- `colors.semantic.theme.background.toggle.handle`
- `colors.semantic.theme.background.toggle.handleDisabled`

### Radius Tokens
- `radius.scale.full`

### Shadow Tokens
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`

### Spacing Tokens
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.28`

### Border Tokens
- `border.width.0`

## Variants
- `size`: `sm | md`
- `active`: `checked={false | true}`
- `state`: `default | hover | focus | disabled` (`state` prop)

## Visual Validation (MCP)
- Size 비교
  - `sm`: track `28x16`, knob `12`, inset `2`
  - `md`: track `34x20`, knob `16`, inset `2`
- Active 위치
  - `False`: `pl2 / pr14(sm), pr16(md)`
  - `True`: `pl14(sm), pl16(md) / pr2`
- Hover/Disabled 색상
  - inactive/active 각각 `hover`, `activeHover`, `disabled`, `activeDisabled`로 분기
- Focus
  - focus ring 표현 존재
  - 구현은 `shadows.focusRing.light.css` 토큰으로 통일

## Behavior
- Interaction states
  - `default/hover/focus/disabled`를 강제하는 `state` prop 지원
  - `state` 미지정 시 실제 hover/focus 인터랙션으로 시각 상태 결정
- Checked behavior
  - controlled: `checked` + `onCheckedChange`
  - uncontrolled: `defaultChecked`
- Transition logic
  - Figma 노드에서 전용 모션 토큰/트랜지션 정의가 없어 추가 transition 없음

## Accessibility Notes
- `role="switch"`, `aria-checked` 적용
- `disabled`/`state=disabled` 시 클릭 차단 + `aria-disabled` 적용
- `button` 기반이라 기본 키보드 조작(Enter/Space) 지원

## Usage Examples
```tsx
import { Toggle } from './Toggle';

export function Example() {
  return (
    <>
      <Toggle size="sm" defaultChecked />
      <Toggle size="md" checked={true} onCheckedChange={(next) => console.log(next)} />
      <Toggle size="md" checked={false} state="focus" aria-label="Focus preview" />
      <Toggle size="sm" checked={true} disabled />
    </>
  );
}
```
