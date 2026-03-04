# Icons

## Purpose
`Icons`는 Figma 아이콘 라이브러리 노드(`1403:50643`)를 코드에서 재사용하기 위한 기본 아이콘 컴포넌트입니다.
아이콘 명명 규칙(`name` + `type`)을 이용해 로컬 SVG 자산(`/assets/icons`)을 매핑하고, 상태/접근성/토큰 연동을 통합합니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

Asset Source of Truth:
- `/Users/309agent/cursor/309-design-library/assets/icons`
- `/Users/309agent/cursor/309-design-library/components/Icons/icon-catalog.ts` (자동 생성)

## MCP Extraction Summary
- Figma `Icons` 섹션은 대규모 심볼 집합으로 구성됨
- 개별 심볼 규격은 `24 x 24`
- 심볼 명명은 `*-line`, `*-fill` 패턴 중심
- 섹션 row cell은 `72 x 72` 레이아웃으로 정렬
- 아이콘 자체에는 별도 hover/focus/disabled variant 축이 없어, 컴포넌트 레벨에서 상태 제어를 분리

## Token Usage
아래 토큰만 사용합니다.

### Color Tokens
- `colors.semantic.theme.icon.base.staticDark`
- `colors.semantic.theme.icon.base.staticDarkSecondary`
- `colors.semantic.theme.icon.base.staticDarkTertiary`
- `colors.semantic.theme.icon.base.staticDarkQuaternary`
- `colors.semantic.theme.icon.base.staticWhite`
- `colors.semantic.theme.icon.base.staticWhiteSecondary`
- `colors.semantic.theme.icon.base.staticWhiteTertiary`
- `colors.semantic.theme.icon.base.staticWhiteQuaternary`
- `colors.semantic.theme.icon.status.success`
- `colors.semantic.theme.icon.status.warning`
- `colors.semantic.theme.icon.status.destructive`
- `colors.semantic.theme.icon.status.info`
- `colors.primitive.palette.base.transparent`

### Spacing Tokens
- `spacing.scale.0`
- `spacing.scale.4`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.24`

### Border / Radius / Shadow Tokens
- `border.width.0`
- `radius.scale.md`
- `shadows.focusRing.light.css`

## Variants
- `name: string`
  - Figma 심볼 키(예: `add-circle`, `arrow-right`, `download`)
  - 컴포넌트 내부에서 `{name}-{type}.svg` → `{name}.svg` 순서로 fallback 매핑
- `type: 'line' | 'fill'`
- `size: '14' | '16' | '20' | '24'`
  - 모두 `spacing.scale` 토큰 기반
- `tone`
  - `primary | secondary | tertiary | quaternary`
  - `inverted | invertedSecondary | invertedTertiary | invertedQuaternary`
  - `success | warning | destructive | info`
- `state: 'default' | 'hover' | 'focus' | 'disabled'`

## Behavior
- 상태 우선순위
  - `disabled` > 강제 `state` > 내부 hover/focus > `default`
- `interactive=true` 또는 `onClick` 전달 시 `<button>` 렌더링
- `focus` 상태에서 `shadows.focusRing.light.css` 적용
- `disabled` 상태는 클릭 차단 + quaternary 색상으로 고정
- transition 토큰이 정의되지 않아 별도 transition 값은 사용하지 않음
- SVG는 CSS `mask` 기반으로 렌더링하여 토큰 색상을 일관 적용

## Accessibility Notes
- 장식 아이콘(`decorative=true`)은 `aria-hidden` 적용
- 의미 아이콘은 `decorative=false` + `ariaLabel` 권장
- 인터랙티브 아이콘은 버튼 role/disabled semantics를 따름

## Usage Examples
```tsx
import { Icons } from './Icons';

export function Example() {
  return (
    <>
      <Icons name="add-circle" type="line" size="24" tone="primary" decorative />

      <Icons
        name="information"
        type="fill"
        size="20"
        tone="info"
        decorative={false}
        ariaLabel="정보 아이콘"
      />

      <Icons
        name="close"
        type="line"
        size="24"
        interactive
        decorative={false}
        ariaLabel="닫기"
        onClick={() => {}}
      />
    </>
  );
}
```

## Asset Management
- 아이콘 원본 동기화: `npm run icons:sync`
- 카탈로그 재생성: `npm run icons:catalog`
- 빌드시 `explorer:build`, `preview:build`에서 자동 실행
