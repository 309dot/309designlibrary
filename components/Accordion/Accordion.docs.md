# Accordion

## Purpose
`Accordion`는 Figma MCP에서 추출된 Variant(`State`, `Expanded`, `Size`)를 기반으로 구현된 접기/펼치기 컴포넌트입니다.

Single Source of Truth:
- `/Users/309agent/cursor/309-design-library/style-tokens.ts`

## Token Usage
아래 토큰만 사용합니다.

### Background
- `colors.primitive.palette.base.white`
- `colors.primitive.palette.gray.1`
- `colors.primitive.palette.gray.2`

### Text / Icon
- `colors.semantic.theme.text.base.staticDark`
- `colors.semantic.theme.text.base.staticDarkSecondary`
- `colors.semantic.theme.icon.base.staticDark`
- `colors.semantic.theme.icon.base.staticDarkSecondary`

### Border / Radius
- `colors.primitive.palette.gray.2a`
- `border.color.theme.action.focusLight`
- `border.width.1`
- `radius.scale.lg`

### Shadow
- `shadows.elevation.xs.css`
- `shadows.focusRing.light.css`

### Typography
- `typography.scale.bodyM.medium`
- `typography.scale.bodyS.medium`
- `typography.scale.bodyS.regular`
- `typography.scale.captionL.regular`

### Spacing / Layout
- `spacing.scale.0`
- `spacing.scale.2`
- `spacing.scale.4`
- `spacing.scale.12`
- `spacing.scale.16`
- `spacing.scale.20`
- `spacing.scale.32`
- `spacing.scale.12` (아이콘 크기용)
- `spacing.scale.20` (아이콘 wrapper 크기용)
- `spacing.primitive.3`

## Variants
- `size`: `lg | md`
- `expanded`: `true | false`
- `state`: `default | hover | focused` (Figma variant set)
- `disabled`: Figma variant set에는 없지만 컴포넌트 API로 제공

## Visual Validation
- Size 비교
  - `lg`: title `bodyM/medium`, lead icon `paddingY=3`
  - `md`: title `bodyS/medium`, lead icon `paddingY=2`
- Padding 비교
  - 공통: `paddingX=20`, `paddingY=16`, `gap=12`
  - Expanded: 본문 영역 노출 시 container gap `4`
  - Slot wrapper: `paddingTop=12`
- Alignment 비교
  - header row: `display:flex`, `alignItems:flex-start`
  - content body 시작점: lead icon이 있을 때 `paddingInlineStart=32`

## Behavior
- 상호작용 상태 우선순위: `disabled > forceState > focus > hover > default`
- 상태별 시각 처리:
  - Collapsed/Default: white + alpha border
  - Collapsed/Hover: neutral surface + alpha border
  - Collapsed/Focused: white + focus light border + focus ring
  - Expanded/Default: neutral surface + alpha border + `shadows.elevation.xs.css`
  - Expanded/Hover: neutral subtle surface + alpha border + `shadows.elevation.xs.css`
  - Expanded/Focused: neutral surface + focus light border + focus ring
- 토글 로직:
  - 클릭 시 `expanded` 토글
  - `expanded` prop 제공 시 controlled
  - 미제공 시 `defaultExpanded` 기반 uncontrolled
- Transition:
  - Figma token에 motion duration/easing 정의가 없어 transition 미적용

## Accessibility Notes
- 헤더는 네이티브 `<button type="button">` 사용
- `aria-expanded`, `aria-controls` 연결
- 펼침 콘텐츠는 `role="region"` + `aria-labelledby` 연결
- `disabled` 상태에서 키보드/포인터 토글 차단
- 장식 아이콘은 `aria-hidden="true"`

## Usage Examples
```tsx
import { Accordion } from './Accordion';

export function Example() {
  return (
    <>
      <Accordion title="Headline text" description="Description" size="lg" />

      <Accordion title="Headline text" description="Description" size="md" defaultExpanded>
        <div>Custom slot content</div>
      </Accordion>

      <Accordion
        title="Headline text"
        description="Description"
        size="lg"
        expanded
        forceState="focused"
        onExpandedChange={(next) => console.log(next)}
      />
    </>
  );
}
```

