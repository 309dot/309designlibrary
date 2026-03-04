# Pagenation

## Purpose
`Pagenation`은 Figma `Pagination` 컴포넌트(`Type=Arrows|Numbers|Buttons`, `Size=md|sm`)를 React + TypeScript로 구현한 페이지 네비게이션 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.base.dark1`
- `colors.primitive.palette.gray.1a`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.13`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.base.staticWhite`

### Typography
- `typography.scale.bodyS.medium`
- `typography.scale.captionL.medium`

### Spacing / Layout
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
- `spacing.scale.24`
- `spacing.scale.32`
- `spacing.scale.40`
- `spacing.scale.320`
- `spacing.scale.400`

### Radius / Border / Shadow
- `radius.scale.full`
- `radius.scale.xl`
- `radius.scale.lg`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`

## Variants
- `type`: `arrows | numbers | buttons`
- `size`: `md | sm`
- `interactionState`: `default | hover | focus | disabled`

## Behavior
- `type=arrows`
  - 좌/우 아이콘 버튼 + 중앙 dot indicator
- `type=numbers`
  - 좌/우 아이콘 버튼 + 숫자/ellipsis 아이템
  - active 아이템은 배경 강조(`gray.1a`)
- `type=buttons`
  - 좌/우 액션 버튼 + 중앙 dot indicator
- `interactionState`
  - Figma Pagination 노드에서 hover/focus/disabled 시각 variant 축은 확인되지 않음
  - `focus`: 접근성 포커스 링 적용
  - `disabled`: 상호작용 차단 및 텍스트 대비 하향
- Transition logic
  - motion 토큰 정의가 없어 즉시 전환

## Accessibility Notes
- 루트에 `role="navigation"` + `aria-label="Pagination"` 적용
- 클릭 요소는 모두 네이티브 `<button type="button">` 사용
- 숫자 active 항목은 `aria-current="page"` 적용
- 비활성 요소는 `disabled` + `aria-disabled` 적용

## Usage Examples
```tsx
import { Pagenation } from './Pagenation';

export function Example() {
  return (
    <>
      <Pagenation type="arrows" size="md" />

      <Pagenation
        type="numbers"
        size="sm"
        numberItems={[
          { id: 'page-1', label: '1' },
          { id: 'more-left', label: '...', kind: 'more', disabled: true },
          { id: 'page-56', label: '56' },
          { id: 'page-57', label: '57', active: true },
          { id: 'page-58', label: '58' },
          { id: 'more-right', label: '...', kind: 'more', disabled: true },
          { id: 'page-100', label: '100' },
        ]}
      />

      <Pagenation type="buttons" size="md" leftButtonLabel="Previous" rightButtonLabel="Next" />
    </>
  );
}
```

