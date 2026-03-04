# Dropdown

## Purpose
`Dropdown`은 Figma `Dropdown Menu` 컴포넌트( `Dropdown / Button`, `Dropdown / Base`, `Dropdown / Select`, `Dropdown / Extended` )를 기준으로 구현한 선택/확장형 드롭다운 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.1a`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.gray.5`
- `colors.primitive.palette.gray.6`
- `colors.primitive.palette.blue.1`
- `colors.primitive.palette.blue.2`
- `colors.primitive.palette.blue.11`
- `colors.primitive.palette.green.8`
- `colors.primitive.palette.green.9`
- `colors.primitive.palette.purple.6`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkTertiary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.base.staticWhite`

### Typography
- `typography.scale.captionL.regular`
- `typography.scale.captionL.medium`
- `typography.scale.captionM.regular`
- `typography.scale.captionM.medium`

### Spacing / Sizing
- `spacing.scale.0`
- `spacing.scale.1`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.28`
- `spacing.scale.32`
- `spacing.scale.36`
- `spacing.scale.40`
- `spacing.scale.48`
- `spacing.scale.52`
- `spacing.scale.112`
- `spacing.scale.160`
- `spacing.scale.224`
- `spacing.scale.320`

### Radius / Border / Shadow
- `radius.scale.xs`
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.xl`
- `radius.scale.full`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`
- `shadows.elevation.lg.css`
- `shadows.focusRing.light.css`

### Reused Component Tokens
- 다중 선택 모드의 체크 표시는 `Checkbox` 컴포넌트를 재사용
- `Checkbox` 내부 토큰(`background.checkbox`, `border.action`, `shadows.elevation.xs`)이 그대로 적용됨

## Variants
- `variant`: `base | select | extended`
- `state`: `default | hover | focus | disabled`
- `selectMode`: `single | multiple` (`variant=select`)
- `itemType`: `default | avatar`
- `size`: `md | lg` (`variant=extended`)
- `position`: `left | right`
- `width`: `compact | regular | wide`
- `open`: `true | false`

## Behavior
- 트리거 버튼 클릭으로 열림/닫힘 전환
- `variant=select`:
  - `single`: 하나만 선택되고 선택 시 메뉴 닫힘
  - `multiple`: 선택 토글(체크박스 표시)
- `state` 미지정 시 hover/focus 상호작용으로 시각 상태 반영
- `disabled` 또는 `state=disabled`에서 상호작용 차단

## Accessibility Notes
- 트리거: `aria-haspopup`, `aria-expanded`, `aria-controls`
- Select 모드 메뉴: `role="listbox"` + `aria-multiselectable`
- Select 모드 아이템: `role="option"` + `aria-selected`
- Base/Extended 모드 아이템: `role="menuitem"`
- Enter/Space 키로 아이템 선택 가능

## Usage Examples
```tsx
import { Dropdown } from './Dropdown';

export function Example() {
  return (
    <>
      <Dropdown variant="base" open width="wide" />

      <Dropdown
        variant="select"
        selectMode="single"
        itemType="default"
        open
        defaultSelectedIds={['option-3']}
      />

      <Dropdown
        variant="select"
        selectMode="multiple"
        itemType="avatar"
        open
        width="regular"
      />

      <Dropdown
        variant="extended"
        size="lg"
        itemType="avatar"
        position="right"
        open
      />
    </>
  );
}
```
