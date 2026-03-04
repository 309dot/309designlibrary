# Tooltip

## Purpose
`Tooltip`은 UI 요소의 의미를 보조 설명하는 컴포넌트입니다.
구현 기준은 Figma MCP 노드 `1428:49982`(Tooltip), `575:31201`(Tooltip Trigger)이며, 툴팁 배치/사이즈와 트리거 활성 상태를 코드로 반영합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background Tokens
- `colors.semantic.theme.background.surface.default`
- `colors.primitive.palette.base.transparent`

### Text Tokens
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

### Icon Tokens
- `colors.semantic.theme.icon.base.staticDark`
- `colors.semantic.theme.icon.base.staticDarkQuaternary`
- `colors.semantic.theme.icon.base.staticWhite`

### Border Tokens
- `border.width.0`
- `border.width.1`
- `border.color.theme.action.normal`

### Shadow Tokens
- `shadows.tooltip.sm.css`

### Radius Tokens
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.full`

### Spacing Tokens
- `spacing.scale.0`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.24`
- `spacing.scale.28`
- `spacing.scale.80`
- `spacing.scale.120`
- `spacing.scale.192`
- `spacing.scale.224`
- `spacing.scale.320`
- `spacing.scale.844`
- `spacing.scale.1024`

### Typography Tokens
- `typography.scale.captionM.regular`
- `typography.scale.captionM.medium`
- `typography.scale.captionS.medium`

## Variants
- Tooltip
  - `size`: `sm | md | lg`
  - `placement`: `bottomLeft | bottomCenter | bottomRight | topLeft | topCenter | topRight | rightSide | leftSide`
  - Figma 기준으로 `lg`는 side 배치가 없어 `leftSide/rightSide` 요청 시 `topCenter`로 정규화
- Tooltip Trigger
  - `active`: `false | true`
  - `showTooltipOnActive`: `true | false`

## Visual Validation (MCP)
- Tooltip size별 박스 스타일
  - `sm`: padding `(8,4)`, radius `sm`, 단일 텍스트
  - `md`: padding `(12,8)`, radius `sm`, 단일 텍스트
  - `lg`: padding `(16,12)`, radius `md`, `headline + description`
- Arrow
  - 상하 배치: `tippy container height 6`, 화살표 폭 `14`, 높이 `4`, 좌우 오프셋 `10`
  - 좌우 배치: `tippy container width 6`, 화살표 폭 `4`, 높이 `14`
- Trigger
  - 크기 `24`, 아이콘 원형 `14`
  - `Active=false`: quaternary 원형 아이콘
  - `Active=true`: dark 원형 아이콘 + 기본 `Tooltip(sm, bottomCenter)` 노출

## Behavior
- Tooltip
  - Figma variant에는 hover/focus/disabled 상태 축이 없음
  - 배치/사이즈 조합만 시각 variant로 존재
- Tooltip Trigger
  - `active` controlled / `defaultActive` uncontrolled 지원
  - 클릭 시 active 토글 + `onActiveChange` 호출
- Transition
  - Figma 노드에서 별도 모션 토큰 정의가 없어 transition 미적용

## Accessibility Notes
- Tooltip: `role="tooltip"`
- Trigger: `button` + `aria-pressed`, 활성 시 `aria-describedby`로 tooltip 연결
- `disabled` 상태에서 토글 차단

## Usage Examples
```tsx
import { Tooltip, TooltipTrigger } from './Tooltip';

export function Example() {
  return (
    <>
      <Tooltip size="sm" placement="bottomCenter" text="Tooltip text" />

      <Tooltip
        size="lg"
        placement="topRight"
        headline="Tooltip headline"
        description="Tooltips display informative text when users hover over, focus on, or tap an element"
      />

      <TooltipTrigger
        defaultActive
        tooltipProps={{
          size: 'sm',
          placement: 'bottomCenter',
          text: 'Tooltip text',
        }}
      />
    </>
  );
}
```
