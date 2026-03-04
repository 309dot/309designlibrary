# Task Card

## Purpose
`TaskCard`는 Figma `Task Card` 컴포넌트(`State=Default|Hover`)를 기준으로 작업 요약 정보를 보여주는 카드입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkTertiary`

### Typography
- `typography.scale.bodyS.medium`
- `typography.scale.captionL.regular`
- `typography.scale.captionL.medium`
- `typography.scale.captionM.medium`

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.400`

### Radius / Border / Shadow
- `radius.scale.md`
- `radius.scale.lg`
- `border.width.1`
- `shadows.elevation.xs.css`

## Variants
- `state`: `default | hover`

## Behavior
- hover 상태에서는 배경이 `gray.1`로 변경됩니다.
- `state` prop 미지정 + `interactive=true`일 때 마우스 hover로 상태가 전환됩니다.
- `onClick`이 제공되면 `Enter/Space` 키 입력으로 클릭을 트리거합니다.

## Accessibility Notes
- 루트는 `<article>`입니다.
- `onClick`이 있으면 `role="button"`, `tabIndex=0`, 키보드 핸들링을 적용합니다.
- Figma 정의상 `focus`, `disabled` variant는 제공되지 않아 별도 스타일은 구현하지 않았습니다.

## Usage Examples
```tsx
import { TaskCard } from './TaskCard';

export function Example() {
  return (
    <>
      <TaskCard state="default" />
      <TaskCard state="hover" />
      <TaskCard
        tags={['Design', 'Hiring']}
        onClick={() => {
          // handle click
        }}
      />
    </>
  );
}
```
