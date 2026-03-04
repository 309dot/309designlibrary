# Navigation Bar

## Purpose
`NavigationBar`는 Figma `Navigation Bar` 컴포넌트(`Type=01~08`)를 React + TypeScript로 구현한 상단 내비게이션 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Colors
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.base.transparent`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.1a`
- `colors.primitive.palette.gray.2`
- `colors.primitive.palette.gray.2a`
- `colors.primitive.palette.gray.3`
- `colors.primitive.palette.gray.13`
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.text.base.staticDarkTertiary`
- `colors.semantic.theme.text.base.staticDarkQuaternary`
- `colors.semantic.theme.text.base.staticWhite`
- `colors.semantic.theme.text.accent.blueAccent`

### Typography
- `typography.scale.captionL.regular`
- `typography.scale.captionL.medium`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.1`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.6`
- `spacing.scale.8`
- `spacing.scale.10`
- `spacing.scale.14`
- `spacing.scale.16`
- `spacing.scale.24`
- `spacing.scale.32`
- `spacing.scale.64`
- `spacing.scale.112`
- `spacing.scale.120`
- `spacing.scale.144`
- `spacing.scale.1440`
- `spacing.primitive.360`

### Radius / Border / Shadow
- `radius.scale.sm`
- `radius.scale.md`
- `radius.scale.lg`
- `radius.scale.xxl`
- `radius.scale.full`
- `border.width.0`
- `border.width.1`
- `border.width.2`
- `border.color.theme.select.primary`
- `shadows.elevation.xs.css`
- `shadows.elevation.lg.css`
- `shadows.focusRing.light.css`

## Variants
- `type`: `01 | 02 | 03 | 04 | 05 | 06 | 07 | 08`
- `interactionState`: `default | hover | focus | disabled`

## Behavior
- `type`별 레이아웃:
  - `01~04`: 기본 로고 + 링크 행
  - `05`: 좌/중앙/우 3열 레이아웃(우측 빈 영역 포함)
  - `06`: 검색 필드 + `Explore` + `Pro Access`
  - `07`: 라운드 컨테이너 + CTA 버튼
  - `08`: 상단(검색/아바타) + 하단 탭 메뉴
- Interaction state:
  - Figma에서 링크별 hover/focus/disabled 개별 variant 축은 확인되지 않아 시각 값은 기본값 중심으로 유지
  - `focus`는 토큰 포커스 링(`shadows.focusRing.light.css`) 반영
  - `disabled`는 텍스트/인터랙션 비활성화 처리
- Transition logic:
  - 전용 motion 토큰이 없어 즉시 상태 전환으로 구현

## Accessibility Notes
- 루트는 `<header>`로 렌더링
- 네비게이션 항목/탭/CTA는 네이티브 `<button type="button">` 사용
- 활성 탭은 `aria-current="page"` 제공
- disabled 상태는 `disabled` + `aria-disabled` 사용

## Usage Examples
```tsx
import { NavigationBar } from './NavigationBar';

export function Example() {
  return (
    <>
      <NavigationBar type="01" />

      <NavigationBar
        type="06"
        searchPlaceholder="Search..."
        searchShortcutLabel="/"
        interactionState="focus"
      />

      <NavigationBar
        type="08"
        activeBottomLinkId="studio"
        onBottomLinkClick={(id) => {
          console.log(id);
        }}
      />
    </>
  );
}
```

