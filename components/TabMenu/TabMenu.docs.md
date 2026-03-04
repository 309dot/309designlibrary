# TabMenu

## Purpose
`TabMenu`는 상위 카테고리 전환에 사용하는 탭 네비게이션 컴포넌트입니다.
구현 기준은 Figma MCP 노드 `953:18063`이며, `Type(fill/line/segmented)` + `Size(lg/md/sm)` variant를 그대로 반영합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Color Tokens
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.background.button.tertiary`
- `colors.semantic.theme.background.button.secondary`
- `colors.semantic.theme.background.overlay.custom`
- `colors.primitive.palette.base.transparent`

### Border Tokens
- `border.width.0`
- `border.width.1`
- `border.width.2`
- `border.color.theme.select.primary`
- `border.color.theme.action.normal`

### Shadow Tokens
- `shadows.elevation.xs.css`

### Radius Tokens
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.lg`
- `radius.scale.xl`

### Spacing Tokens
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.24`
- `spacing.primitive.5`
- `spacing.primitive.7`

### Typography Tokens
- `typography.scale.bodyS.medium`
- `typography.scale.captionL.medium`
- `typography.scale.captionM.medium`

## Variants
- `type`: `fill | line | segmented`
- `size`: `lg | md | sm`

## Visual Validation (MCP)
- Fill
  - `lg`: gap `8`, item padding `(16,12)`, radius `xl`
  - `md`: gap `8`, item padding `(12,8)`, radius `xl`
  - `sm`: gap `8`, item padding `(12,6)`, radius `lg`
  - active item: `background.button.tertiary`
- Line
  - all size gap `24`, active underline `2px` with `border.color.theme.select.primary`
  - `lg`: `pt10 pb14`
  - `md`: `pt6 pb10`
  - `sm`: `pt5 pb7`
- Segmented
  - root: `overlay.custom`, `p2`, `gap2`
  - `lg/md` root radius `xl`, `sm` root radius `lg`
  - active item: `background.button.secondary + border.action.normal + shadows.elevation.xs`
  - item padding `lg(12,10) / md(10,6) / sm(8,4)`

## Behavior
- Selection
  - `selectedId`(controlled) / `defaultSelectedId`(uncontrolled) 지원
  - 클릭 시 `onSelectedIdChange` 발생
- Keyboard interaction
  - `ArrowLeft/ArrowUp`: 이전 탭
  - `ArrowRight/ArrowDown`: 다음 탭
  - `Home`: 첫 탭, `End`: 마지막 탭
- State extraction result
  - Figma `Tab Menu(953:18063)` variant 축은 `Type`, `Size`만 존재
  - hover/focus/disabled 전용 시각 variant는 없어 기본 시각값 유지
  - `forceItemState`는 행동 검증용 상태 강제 API로 제공
- Transition
  - Figma node에서 전용 모션 토큰/트랜지션 정의가 없어 추가 transition 없음

## Accessibility Notes
- 루트: `role="tablist"`, `aria-orientation="horizontal"`
- 아이템: `role="tab"`, `aria-selected`, `aria-disabled`
- roving focus(tabIndex) + 방향키 내비게이션 지원
- `disabled` 아이템은 클릭/키보드 선택 불가

## Usage Examples
```tsx
import { TabMenu } from './TabMenu';

export function Example() {
  return (
    <>
      <TabMenu type="fill" size="lg" />
      <TabMenu type="line" size="md" defaultSelectedId="tab-03" />
      <TabMenu
        type="segmented"
        size="sm"
        items={[
          { id: 'a', label: 'Overview' },
          { id: 'b', label: 'Tasks', badge: '12' },
          { id: 'c', label: 'Alerts', badge: '08' },
        ]}
      />
    </>
  );
}
```
