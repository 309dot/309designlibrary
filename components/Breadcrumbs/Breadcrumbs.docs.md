# Breadcrumbs

## Purpose
`Breadcrumbs`는 현재 페이지 위치를 계층 경로로 표시하는 내비게이션 컴포넌트입니다.
구현 기준은 Figma MCP 노드 `2563:20470`이며, 스타일 값은 `style-tokens.ts`만 사용합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Typography
- `typography.scale.captionL.medium`
- `typography.scale.captionM.medium`
- `typography.scale.captionS.medium`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.14`
- `spacing.scale.16`

### Color
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

## Variants
Figma variant axes:
- `size`: `sm | md`
- `divider`: `icon | slash`

추가 구현 props:
- `forceState`: `default | hover | focus | disabled` (검증/프리뷰용)

## Visual Validation
- Size 비교
  - `sm`: item stack gap `4`, icon `14`, label typography `captionM`, slash typography `captionS`
  - `md`: item stack gap `6`, icon `16`, label typography `captionL`, slash typography `captionM`
- Padding 비교
  - Figma 원본에서 item/label 별도 padding 없음
- Alignment 비교
  - root: `inline-flex`, `alignItems:flex-start`, `gap:8`
  - item: `inline-flex`, `alignItems:center`, `gap:8`

## Behavior
- Interaction states
  - Figma Breadcrumbs variant set에는 `hover/focus/disabled` 축이 정의되어 있지 않음
  - 따라서 `hover/focus`는 `default`와 동일 시각 처리
  - `disabled`는 비활성 의미 전달(`aria-disabled`) 중심으로 처리
- Transition logic
  - Figma/MCP에 Breadcrumbs 전용 motion token이 없어 transition 추가 없음
- Current item
  - `items[].current=true`가 있으면 해당 item을 현재 위치로 사용
  - 없으면 마지막 item을 현재 위치로 간주

## Accessibility Notes
- 루트는 `<nav aria-label="Breadcrumb">`
- 경로는 `<ol><li>` 구조 사용
- 현재 항목은 `aria-current="page"` 적용
- 비활성 항목은 `aria-disabled` 적용
- 링크 가능한 항목은 `<a>`로 렌더링

## Usage Examples
```tsx
import { Breadcrumbs } from './Breadcrumbs';

export function Example() {
  return (
    <>
      <Breadcrumbs
        size="sm"
        divider="icon"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Breadcrumbs', current: true },
        ]}
      />

      <Breadcrumbs
        size="md"
        divider="slash"
        forceState="default"
        items={[
          { label: 'Workspace', href: '/workspace' },
          { label: 'Design System', href: '/workspace/design-system' },
          { label: 'Components', href: '/workspace/design-system/components' },
          { label: 'Breadcrumbs', current: true },
        ]}
      />
    </>
  );
}
```
