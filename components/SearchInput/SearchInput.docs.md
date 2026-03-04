# SearchInput

## Purpose
`SearchInput`은 Figma `Search Input` 컴포넌트(`State=Default | Filled | Disabled`)를 반영한 검색 입력 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.gray.2`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkTertiary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`

### Typography
- `typography.scale.captionL.regular`
- `typography.scale.captionM.medium`

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.40`
- `spacing.scale.390`
- `spacing.primitive.3`

### Radius
- `radius.scale.sm`

## Variants
- `state`: `default | filled | disabled`

## Behavior
- `state`를 전달하면 상태를 강제 적용합니다.
- `state` 미전달 시 `value` 유무로 `default/filled`를 자동 계산합니다.
- `disabled` 또는 `state=disabled`인 경우 입력을 비활성화합니다.

## Accessibility Notes
- 실제 `<input>` 요소를 사용합니다.
- `inputAriaLabel`로 검색 필드 접근성 라벨을 지정할 수 있습니다.

## Token Verification
- 검색 입력의 배경/텍스트/뱃지/간격/타이포그래피는 `style-tokens.ts` 값만 사용합니다.
- Figma 상태별 텍스트 톤(default/filled/disabled)을 토큰으로 매핑했습니다.

## Usage Examples
```tsx
import { SearchInput } from './SearchInput';

export function Example() {
  return (
    <>
      <SearchInput placeholder="Placeholder" />

      <SearchInput
        state="filled"
        value="Keyword"
        onValueChange={(nextValue) => {
          // handle search text
        }}
      />

      <SearchInput state="disabled" value="Placeholder" />
    </>
  );
}
```
