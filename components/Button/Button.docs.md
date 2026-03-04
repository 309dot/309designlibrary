# Button

## Purpose
`Button` 컴포넌트는 Figma MCP 추출 토큰(`309-design-tokens.tokens.json`, `tokens/Theme/Light.json`)을 기반으로 구현된 액션 트리거 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background
- `colors.semantic.theme.background.button.primary`
- `colors.semantic.theme.background.button.primaryHover`
- `colors.semantic.theme.background.button.primaryDisabled`
- `colors.semantic.theme.background.button.secondary`
- `colors.semantic.theme.background.button.secondaryHover`
- `colors.semantic.theme.background.button.secondaryDisabled`
- `colors.semantic.theme.background.button.tertiary`
- `colors.semantic.theme.background.button.tertiaryHover`
- `colors.semantic.theme.background.button.tertiaryDisabled`
- `colors.semantic.theme.background.button.ghost`
- `colors.semantic.theme.background.button.ghostHover`
- `colors.semantic.theme.background.button.ghostDisabled`
- `colors.semantic.theme.background.button.destructive`
- `colors.semantic.theme.background.button.destructiveHover`
- `colors.semantic.theme.background.button.destructiveDisabled`
- `colors.semantic.theme.background.button.destructiveSecondary`
- `colors.semantic.theme.background.button.destructiveSecondaryHover`
- `colors.semantic.theme.background.button.destructiveSecondaryDisabled`
- `colors.semantic.theme.background.button.destructiveTertiary`
- `colors.semantic.theme.background.button.destructiveTertiaryHover`
- `colors.semantic.theme.background.button.destructiveTertiaryDisabled`
- `colors.semantic.theme.background.button.destructiveGhost`
- `colors.semantic.theme.background.button.destructiveGhostHover`
- `colors.semantic.theme.background.button.destructiveGhostDisabled`

### Text
- `colors.semantic.theme.text.base.inverted`
- `colors.semantic.theme.text.base.invertedSecondary`
- `colors.semantic.theme.text.base.primary`
- `colors.semantic.theme.text.base.secondary`
- `colors.semantic.theme.text.base.staticWhite`
- `colors.semantic.theme.text.base.staticWhiteSecondary`
- `colors.semantic.theme.text.status.destructive`
- `colors.semantic.theme.text.status.destructiveSecondary`

### Border
- `border.color.theme.action.normal`
- `border.color.theme.action.hover`
- `border.color.theme.action.disabled`
- `border.color.theme.action.focus`
- `border.color.theme.action.destructive`
- `border.color.theme.action.destructiveHover`
- `border.color.theme.action.destructiveDisabled`
- `border.color.theme.action.focusDestructive`
- `border.width.1`

### Focus Ring / Shadow
- `shadows.focusRing.light.css`
- `shadows.focusRing.lightDestructive.css`

### Size / Layout
- `spacing.scale.24`
- `spacing.scale.32`
- `spacing.scale.40`
- `spacing.scale.48`
- `spacing.scale.14`
- `spacing.scale.12`
- `spacing.scale.10`
- `spacing.scale.8`
- `spacing.scale.6`
- `spacing.scale.5`
- `spacing.scale.4`
- `spacing.scale.2`
- `spacing.scale.0`
- `spacing.scale.16`
- `radius.scale.full`
- `radius.scale.xl`
- `radius.scale.lg`
- `radius.scale.md`

### Typography
- `typography.scale.captionM.medium`
- `typography.scale.captionL.medium`
- `typography.scale.bodyS.medium`
- `typography.scale.bodyL.medium`

## Variants
- `primary`
- `secondary`
- `tertiary`
- `ghost`
- `destructive`
- `destructiveSecondary`
- `destructiveTertiary`
- `destructiveGhost`

## Type
- `default`
- `iconOnly`

## Shape
- `rounded`
- `pill`

## Visual Validation
- Size 비교
  - `xs`: `minHeight=spacing.scale.24`
  - `sm`: `minHeight=spacing.scale.32`
  - `md`: `minHeight=spacing.scale.40`
  - `lg`: `minHeight=spacing.scale.48`
- Padding 비교
  - `type=default`: `xs(8,4)`, `sm(10,6)`, `md(12,10)`, `lg(16,12)` (`paddingX`,`paddingY`)
  - `type=iconOnly`: `xs(5)`, `sm(8)`, `md(10)`, `lg(14)` (all sides)
- Alignment 비교
  - `display:inline-flex`, `alignItems:center`, `justifyContent:center`
  - 아이콘 슬롯은 `iconSize=spacing.scale.24`
  - `shape=rounded`는 size별 radius(`md/lg/xl/xl`), `shape=pill`은 `radius.scale.full`

## Behavior
- 상태: `default`, `hover`, `focus`, `disabled`
- 상태 우선순위: `disabled > forceState > focus > hover > default`
- Variant axes: `variant + type + shape + size`
- Focus ring:
  - 일반 variant: `shadows.focusRing.light.css`
  - destructive 계열: `shadows.focusRing.lightDestructive.css`
- Transition: 토큰에 duration/easing 정의가 없어 즉시 상태 전환으로 구현

## Behavioral Validation
- Interaction states
  - Hover: 배경/보더/텍스트를 `*Hover` 토큰으로 변경
  - Focus: 보더 `focus` 계열 토큰 + focus ring shadow 토큰 적용
  - Disabled: `*Disabled` 배경/보더/텍스트 토큰 고정 적용
- Transition logic
  - MCP 토큰에 motion duration/easing이 없어 transition 값을 추가하지 않음
- Accessibility behavior
  - 네이티브 button, `disabled` 속성, 키보드 focus 시각화, 장식 아이콘 `aria-hidden` 적용

## Accessibility Notes
- 네이티브 `<button>` 요소 사용
- `disabled` 속성으로 비활성 상태 전달
- 키보드 포커스 지원(`onFocus`, `onBlur` + focus visual)
- 장식 아이콘은 `aria-hidden="true"`

## Usage Examples
```tsx
import { Button } from './Button';

export function Example() {
  return (
    <>
      <Button variant="primary" type="default" shape="rounded" size="md">Primary</Button>
      <Button variant="secondary" type="default" shape="pill" size="sm">Pill</Button>
      <Button variant="destructiveGhost" type="iconOnly" shape="pill" size="xs" leftIcon="+">Delete</Button>
      <Button variant="tertiary" type="default" shape="rounded" size="md" disabled>Disabled</Button>
    </>
  );
}
```
