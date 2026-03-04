# Badge

## Purpose
`Badge`는 상태/카테고리/강조 정보를 짧게 표시하는 컴포넌트입니다.
구현 기준은 Figma MCP 노드 `977:29134`이며, 스타일은 `style-tokens.ts`만 사용합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background Tokens
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.blue.2`
- `colors.primitive.palette.blue.1`
- `colors.primitive.palette.green.2`
- `colors.primitive.palette.green.1`
- `colors.primitive.palette.orange.2`
- `colors.primitive.palette.orange.1`
- `colors.primitive.palette.red.2`
- `colors.primitive.palette.red.1`
- `colors.primitive.palette.purple.2`
- `colors.primitive.palette.base.white`

### Text Tokens
- `colors.primitive.palette.gray.9a`
- `colors.primitive.palette.gray.5a`
- `colors.primitive.palette.blue.11`
- `colors.primitive.palette.blue.7a`
- `colors.primitive.palette.green.11`
- `colors.primitive.palette.green.7a`
- `colors.primitive.palette.orange.11`
- `colors.primitive.palette.orange.7a`
- `colors.primitive.palette.red.11`
- `colors.primitive.palette.red.8`
- `colors.primitive.palette.red.7a`
- `colors.primitive.palette.red.5a`
- `colors.primitive.palette.purple.11`
- `colors.primitive.palette.purple.7a`

### Border Tokens
- `border.width.0`
- `border.width.1`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.base.transparent`

### Size / Layout Tokens
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.24`
- `spacing.scale.28`
- `spacing.primitive.3`

### Radius Tokens
- `radius.scale.xs`
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.full`

### Typography Tokens
- `typography.scale.captionL.medium`
- `typography.scale.captionM.medium`

## Variants
- `color`: `gray | blue | green | orange | red | purple | white | whiteDestructive | surface | surfaceDestructive`
- `size`: `xs | sm | md | lg`
- `shape`: `rounded | pill`
- `stroke`: `true | false`
- `state`: `default | hover | focus | disabled` (`forceState`)

## Visual Validation
- Size 비교
  - `lg`: height `28`, outer padding `(6,4)`, label paddingX `4`, icon `16`, radius `md`
  - `md`: height `24`, outer padding `(4,2)`, label paddingX `4`, icon `16`, radius `md`
  - `sm`: height `20`, outer padding `(3,2)`, label paddingX `3`, icon `14`, radius `sm`
  - `xs`: height `16`, outer padding `(2,0)`, label paddingX `2`, icon `12`, radius `xs`
- Shape 비교
  - `rounded`: size별 radius 적용
  - `pill`: `radius.scale.full`
- Stroke 비교
  - `stroke=false`: border width `0`
  - `stroke=true`: border width `1`, border color `gray.2a`

## Behavior
- Interaction states
  - Figma variant set에 `hover/focus` 시각 variant가 없어서 `hover/focus`는 `default`와 동일 스타일로 동작
  - `disabled`만 별도 시각값 적용
- State 우선순위
  - `disabled(true)` 또는 `forceState=disabled`가 최우선
- Transition logic
  - Figma/MCP에서 Badge 전용 모션 토큰이 없어 transition 값은 추가하지 않음

## Accessibility Notes
- 기본 요소는 비인터랙티브 `div`
- `disabled` 상태 전달을 위해 `aria-disabled` 적용
- 장식 아이콘 슬롯은 `aria-hidden="true"`
- 인터랙션(hover/focus)은 시각 강제 검증용 `forceState`로 확인

## Usage Examples
```tsx
import { Badge } from './Badge';

export function Example() {
  return (
    <>
      <Badge color="gray" size="md" shape="rounded">Badge</Badge>
      <Badge color="blue" size="lg" shape="pill" leadingIcon="●" trailingIcon="#">Info</Badge>
      <Badge color="whiteDestructive" size="sm" stroke>Destructive</Badge>
      <Badge color="purple" size="xs" forceState="disabled" disabled>Disabled</Badge>
    </>
  );
}
```
