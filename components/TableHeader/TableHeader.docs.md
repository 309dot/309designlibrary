# TableHeader

## Purpose
`TableHeader`는 Figma `_Table Header` 컴포넌트(`Direction` variant) 기반의 테이블 헤더 셀입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

### Typography
- `typography.scale.captionL.regular`

### Spacing / Sizing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.8`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.40`
- `spacing.scale.56`
- `spacing.scale.224`

### Radius / Border / Shadow
- `radius.scale.0`
- `border.width.0`
- `border.width.1`
- `border.width.2`

### Reused Component Tokens
- `Checkbox` 재사용: `components/Checkbox/Checkbox.tsx`의 토큰 세트

## Variants
- `direction`: `left | center | right`

## Behavior
- `direction`별 제목 정렬 변경
  - `left`: 시작 정렬
  - `center`: 가운데 정렬
  - `right`: 끝 정렬
- `showCheckbox`, `showSortIcon`으로 보조 UI 노출 제어
- `checkboxChecked` 및 `onCheckboxCheckedChange`로 헤더 선택 상태 제어

## Accessibility Notes
- 헤더 체크박스: `role="checkbox"` (재사용 컴포넌트)
- 정렬 아이콘 버튼: `aria-label="Sort column"`
- 비활성화 시 `aria-disabled` 반영

## Validation Notes (Figma)
- Figma `_Table Header`의 공식 variant 축은 `Direction`만 존재
- Left/Center 노드를 MCP에서 직접 추출했고, Right는 동일한 레이아웃 규칙에서 `justify-end`로 검증

## Usage Examples
```tsx
import { TableHeader } from './TableHeader';

export function Example() {
  return (
    <>
      <TableHeader direction="left" title="Name" showCheckbox />
      <TableHeader direction="center" title="Status" showSortIcon onSortClick={() => {}} />
      <TableHeader direction="right" title="Updated" showCheckbox={false} />
    </>
  );
}
```
