# TableCell

## Purpose
`TableCell`은 Figma `_Table Cell` 컴포넌트( `Type × Size × Direction` )를 코드로 구현한 데이터 테이블 셀입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.5`
- `colors.primitive.palette.gray.7`
- `colors.primitive.palette.gray.8`
- `colors.primitive.palette.blue.2`
- `colors.primitive.palette.blue.3`
- `colors.primitive.palette.blue.8`
- `colors.primitive.palette.blue.11`
- `colors.primitive.palette.green.2`
- `colors.primitive.palette.green.8`
- `colors.primitive.palette.green.11`
- `colors.primitive.palette.orange.2`
- `colors.primitive.palette.orange.3`
- `colors.primitive.palette.orange.11`
- `colors.primitive.palette.purple.3`
- `colors.primitive.palette.purple.11`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`

### Typography
- `typography.scale.bodyS.medium`
- `typography.scale.captionL.regular`
- `typography.scale.captionL.medium`
- `typography.scale.captionM.regular`
- `typography.scale.captionM.medium`

### Spacing / Sizing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.12`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.24`
- `spacing.scale.32`
- `spacing.scale.40`
- `spacing.scale.48`
- `spacing.scale.56`
- `spacing.scale.64`
- `spacing.scale.72`
- `spacing.scale.80`
- `spacing.scale.96`
- `spacing.scale.160`
- `spacing.scale.224`
- `spacing.primitive.1`
- `spacing.primitive.3`
- `spacing.primitive.5`
- `spacing.primitive.7`
- `spacing.primitive.9`

### Radius / Border / Shadow
- `radius.scale.0`
- `radius.scale.md`
- `radius.scale.lg`
- `radius.scale.sm`
- `radius.scale.full`
- `border.width.0`
- `border.width.1`
- `border.width.2`
- `shadows.elevation.xs.css`

### Reused Component Tokens
- `Checkbox` 재사용: `components/Checkbox/Checkbox.tsx`의 토큰 세트
- `Radio` 재사용: `components/Radio/Radio.tsx`의 토큰 세트

## Variants
- `type`:
  - `leadPrimary`
  - `text`
  - `button`
  - `circleCheckbox`
  - `checkbox`
  - `radioButton`
  - `buttonGroup`
  - `toggle`
  - `badge`
  - `badgeGroup`
  - `avatar`
  - `avatarGroup`
  - `progress`
  - `chart`
- `size`: `lg | md | sm`
- `direction`: `left | center | right`

## Behavior
- `direction`에 따라 셀 컨텐츠 정렬(`left/center/right`)을 변경
- `leadPrimary`와 `text`는 타이틀/캡션 구조를 유지
- `checkbox`, `radioButton`, `toggle`, `circleCheckbox`는 제어형 props(`checked` 계열 + 콜백) 지원
- `progress`는 `progressValue(0~100)` 기준으로 게이지 Fill을 렌더링
- `chart`는 `chartPoints` 배열 기반 Sparkline/Area를 렌더링

## Accessibility Notes
- `checkbox`: `role="checkbox"` (재사용 컴포넌트)
- `radioButton`: `role="radio"` (재사용 컴포넌트)
- `circleCheckbox`: `role="checkbox"`
- `toggle`: `role="switch"`
- 상태 비활성화 시 `aria-disabled`를 반영

## Validation Notes (Figma)
- Figma `_Table Cell` 노드에서 공식 variant 축은 `Type/Size/Direction`만 존재
- `hover/focus/disabled`는 별도 variant 축으로 정의되어 있지 않음
- 따라서 본 컴포넌트는 Figma에서 확인된 기본 시각 상태를 우선 구현하고, 제어형 요소는 접근성 속성과 콜백 중심으로 동작

## Usage Examples
```tsx
import { TableCell } from './TableCell';

export function Example() {
  return (
    <>
      <TableCell type="text" size="lg" direction="left" title="Project" caption="In progress" />

      <TableCell
        type="leadPrimary"
        size="md"
        direction="center"
        title="Anna"
        caption="Owner"
        showAvatar
        showTailButton
      />

      <TableCell
        type="toggle"
        size="sm"
        direction="right"
        toggleChecked
        onToggleCheckedChange={(next) => console.log(next)}
      />

      <TableCell type="progress" size="md" direction="left" progressValue={70} />

      <TableCell type="chart" size="sm" direction="right" chartPoints={[10, 15, 20, 45, 40, 55, 72]} />
    </>
  );
}
```
