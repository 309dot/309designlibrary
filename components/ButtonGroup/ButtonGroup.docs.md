# Button Group

## Purpose
`ButtonGroup`는 Figma MCP에서 추출한 `Button Group` / `Button Group Item` variant를 기반으로 여러 액션을 한 줄에서 정렬해 제공하는 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`

### Text / Icon
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`

### Border
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.gray.3`
- `border.color.theme.action.focusLight`
- `border.width.0`
- `border.width.1`
- `border.width.2`

### Radius
- `radius.scale.0`
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.lg`
- `radius.scale.xl`
- `radius.scale.full`

### Shadow
- `shadows.elevation.xs.css`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.1`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.primitive.3`

### Typography
- `typography.scale.bodyS.medium`
- `typography.scale.captionL.medium`
- `typography.scale.captionM.medium`

## Variants
- Group
  - `size`: `lg | md | sm`
  - `shape`: `rounded | pill`
- Item
  - `type`: `default | iconOnly`
  - `state`: `default | hover | focus | active | disabled`
  - `align`: `left | center | right`

## Visual Validation
- Size 비교
  - `lg`: default item `px14/py12`, icon-only `p14`, text `bodyS/medium`
  - `md`: default item `px12/py10`, icon-only `p10`, text `captionL/medium`
  - `sm`: default item `px10/py6`, icon-only `p8`, text `captionL/medium`
- Padding 비교
  - Pill + icon-only는 align에 따라 비대칭 패딩 적용
    - left: `start = base + 4`, `end = base`
    - right: `start = base`, `end = base + 4`
- Alignment 비교
  - left: 좌측 radius + 좌측 보더 + 우측 divider
  - center: radius 없음 + 상하 보더 + 우측 divider
  - right: 우측 radius + 우측 보더 + divider 없음

## Behavior
- 상태 우선순위:
  - `disabled > explicit item state > forceState > pressed/active > focus > hover > default`
- 상태별 시각 처리:
  - `hover`/`active`: `background = gray.1`
  - `focus`: `border width = 2`, `border color = focusLight`
  - `disabled`: 텍스트/배지 텍스트를 quaternary로 변경
- Divider:
  - right align 제외 아이템에서 수직 divider 유지
  - focus에서는 divider offset을 border width(2)에 맞춰 조정
- Transition logic:
  - motion token(duration/easing)이 없어 즉시 상태 전환으로 구현

## Accessibility Notes
- 그룹 컨테이너에 `role="group"` 적용
- 각 아이템은 네이티브 `<button type="button">` 사용
- disabled 상태는 네이티브 `disabled` 속성 사용
- active 상태 아이템은 `aria-pressed` 노출

## Usage Examples
```tsx
import { ButtonGroup } from './ButtonGroup';

export function Example() {
  return (
    <>
      <ButtonGroup
        size="lg"
        shape="rounded"
        items={[
          { label: 'Button', badgeLabel: '16', type: 'default' },
          { label: 'Button', badgeLabel: '16', type: 'default', active: true },
          { label: 'Button', badgeLabel: '16', type: 'default' },
        ]}
      />

      <ButtonGroup
        size="md"
        shape="pill"
        forceState="focus"
        items={[
          { type: 'iconOnly' },
          { type: 'iconOnly' },
          { type: 'iconOnly' },
        ]}
      />
    </>
  );
}
```

