# CheckboxLabel

## Purpose
`CheckboxLabel`은 Figma `Checkbox Label` 컴포넌트(`Size`, `Type`, `State`)를 기준으로 구현한 라벨 결합형 체크 컴포넌트입니다.

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

### Spacing
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.8`
- `spacing.scale.12`

### Internal Checkbox
- `Checkbox` 컴포넌트에서 사용하는 토큰을 재사용
- 색상/보더/반경/그림자 토큰은 `Checkbox` 구현 기준과 동일

## Variants
- `size`: `sm | md`
- `type`: `default | checked | indeterminate`
- `state`: `default | hover | focus | disabled`
- `showCaption`: `boolean`

## Behavior
- 클릭/Enter/Space 입력 시 타입 전환
- 전환 규칙: `default -> checked -> default`, `indeterminate -> checked`
- `state` prop이 주어지면 강제 상태, 없으면 hover/focus 상호작용으로 상태 반영
- `disabled` 또는 `state=disabled`면 상호작용 비활성화

## Accessibility Notes
- 루트에 `role="checkbox"` 적용
- `aria-checked`를 `true | false | mixed`로 제공
- `tabIndex`와 키보드 이벤트로 조작 가능 상태 제공
- 비활성 상태에서 `aria-disabled`와 키보드 상호작용 차단

## Usage Examples
```tsx
import { CheckboxLabel } from './CheckboxLabel';

export function Example() {
  return (
    <>
      <CheckboxLabel size="sm" type="default" label="약관 동의" caption="선택 항목" />
      <CheckboxLabel size="md" type="checked" label="마케팅 수신" caption="이메일" />
      <CheckboxLabel size="md" type="indeterminate" state="focus" showCaption={false} />
    </>
  );
}
```
