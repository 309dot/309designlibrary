# Input

## Purpose
`Input`은 Figma `Input` 컴포넌트(`Type`, `Size`, `Target`, `State`)를 코드로 반영한 텍스트 입력 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.4`
- `colors.primitive.palette.purple.6`
- `colors.primitive.palette.red.4`
- `colors.primitive.palette.red.5`
- `colors.primitive.palette.red.6`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkTertiary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.status.destructive`

### Typography
- `typography.scale.captionL.regular`
- `typography.scale.captionL.medium`

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.144`
- `spacing.scale.400`

### Radius / Border / Shadow
- `radius.scale.0`
- `radius.scale.sm`
- `radius.scale.lg`
- `radius.scale.xl`
- `border.width.0`
- `border.width.1`
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`
- `shadows.focusRing.lightDestructive.css`

## Variants
- `type`: `default | external | button`
- `size`: `md | xs`
- `target`: `default | destructive`
- `state`: `default | hover | focus | filled | disabled`

## Behavior
- `state`를 전달하면 지정한 시각 상태를 강제 적용합니다.
- `state` 미전달 시 `hover/focus/value`에 따라 자동 상태를 계산합니다.
- `target=destructive`에서 helper 텍스트/아이콘은 destructive 스타일로 변경됩니다.
- `type=button`은 우측 액션 버튼 영역을 포함하고 `onButtonClick`을 제공합니다.
- `type=external`은 좌측 외부 프리픽스 영역(`externalLabel`)을 포함합니다.

## Accessibility Notes
- 실제 `<input>` 요소를 사용합니다.
- `disabled` 상태에서 입력/버튼 상호작용을 차단합니다.
- 포커스 시 Figma focus ring(`light`, `lightDestructive`)을 적용합니다.
- `inputAriaLabel`로 입력 필드 보조 텍스트를 지정할 수 있습니다.

## Token Verification
- 컬러, 타이포그래피, 간격, radius, border, shadow는 `style-tokens.ts` 참조값만 사용합니다.
- Figma 상태별 보더/포커스/헬퍼 컬러는 토큰 값으로 매핑되어 하드코딩을 피합니다.

## Usage Examples
```tsx
import { Input } from './Input';

export function Example() {
  return (
    <>
      <Input
        type="default"
        size="md"
        target="default"
        placeholder="Placeholder"
      />

      <Input
        type="button"
        size="xs"
        target="destructive"
        state="focus"
        value="Filled text"
        onButtonClick={() => {
          // action
        }}
      />

      <Input
        type="external"
        size="md"
        externalLabel="Company"
        state="disabled"
      />
    </>
  );
}
```
