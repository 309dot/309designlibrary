# RadioLabel

## Purpose
`RadioLabel`은 Figma `Radio label` 컴포넌트(`Size`, `Active`, `State`)를 기준으로 구현한 라디오 + 텍스트 조합 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

### Typography
- `typography.scale.captionL.medium`
- `typography.scale.captionL.regular`
- `typography.scale.bodyS.medium`
- `typography.scale.bodyS.regular`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.12`

### Composition
- `Radio` 컴포넌트의 토큰 기반 스타일을 그대로 재사용

## Variants
- `size`: `sm | md`
- `checked`: `boolean`
- `state`: `default | hover | focus | disabled`
- `showCaption`: `boolean`

## Behavior
- 전체 래퍼 클릭/키보드(Enter, Space)로 선택 처리
- `disabled` 또는 `state=disabled`면 상호작용 비활성화
- 선택되지 않은 상태에서만 `onCheckedChange(true)` 호출
- `state` prop이 없으면 hover/focus 상호작용으로 상태 계산

## Accessibility Notes
- 래퍼에 `role="radio"`, `aria-checked`, `aria-disabled` 적용
- 키보드 탐색을 위해 `tabIndex` 제어
- 실제 아이콘 영역은 `Radio` 컴포넌트를 사용해 일관된 접근성 속성 유지

## Usage Examples
```tsx
import { RadioLabel } from './RadioLabel';

export function Example() {
  return (
    <>
      <RadioLabel size="sm" checked={false} label="옵션 A" caption="설명" />
      <RadioLabel size="md" checked label="옵션 B" caption="설명" />
      <RadioLabel size="md" checked state="focus" showCaption={false} />
      <RadioLabel size="sm" checked={false} state="disabled" />
    </>
  );
}
```
