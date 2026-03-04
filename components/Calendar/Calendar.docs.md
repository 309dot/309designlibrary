# Calendar

## Purpose
`Calendar`는 Figma `Calendar` 컴포넌트(`Type=Date | Date Range`)를 기준으로 날짜 선택과 기간 선택을 지원하는 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1a`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.13`
- `colors.primitive.palette.purple.8`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.accent.purpleAccent`

### Typography
- `typography.scale.captionL.medium`
- `typography.scale.captionL.regular`
- `typography.scale.captionM.regular`

### Spacing
- `spacing.scale.0`
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
- `spacing.scale.36`
- `spacing.scale.144`
- `spacing.scale.288`
- `spacing.scale.480`
- `spacing.primitive.4`

### Radius / Border / Shadow
- `radius.scale.0`
- `radius.scale.md`
- `radius.scale.lg`
- `radius.scale.xl`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`
- `shadows.elevation.lg.css`
- `shadows.focusRing.light.css`

## Variants
- `type`: `date | dateRange`
- 셀 상태 축(추출):
  - Date Item: `default | active | disabled`
  - Date Range Item: `default | hover | active | disabled`
  - Date Range Item 추가 축: `rangeDay(first|middle|last)`, `currentDate(true|false)`

## Behavior
- `type=date`
  - 단일 날짜 선택
  - 선택 셀은 보더(`purple.8`) + white 배경
- `type=dateRange`
  - 시작/종료 날짜 선택
  - 선택 구간 first/middle/last 형태로 채움/보더 처리
  - 종료일 미선택 상태에서 hover 시 preview range 렌더링
- 공통
  - 월 이동(이전/다음)
  - `disabledDate`와 월 외 날짜는 disabled 스타일 적용
  - Footer의 Cancel/Apply 액션 제공

## Accessibility Notes
- 날짜 셀과 네비게이션은 네이티브 `<button>` 사용
- disabled 날짜는 실제 `disabled` 속성 적용
- 키보드 포커스 시 `shadows.focusRing.light.css` 적용

## Usage Examples
```tsx
import { Calendar } from './Calendar';

export function Example() {
  return (
    <>
      <Calendar
        type="date"
        month={1}
        year={2024}
        selectedDate={new Date(2024, 1, 2)}
        onSelectDate={(date) => {
          // handle date
        }}
      />

      <Calendar
        type="dateRange"
        month={1}
        year={2024}
        selectedRange={{ start: new Date(2024, 1, 2), end: new Date(2024, 1, 7) }}
        onSelectRange={(range) => {
          // handle range
        }}
      />
    </>
  );
}
```
