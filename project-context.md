## Session 1
- Date: 2026-03-02 (Asia/Seoul)

### What was built
- Figma MCP 기반 스타일 파운데이션 구축:
  - `style-tokens.ts` 생성 (디자인 토큰 Single Source of Truth)
  - `style-guide.tsx` 생성 (토큰 시각화 페이지)
- 버튼 컴포넌트 구축:
  - `components/Button/Button.tsx`
  - `components/Button/Button.types.ts`
  - `components/Button/Button.preview.tsx`
  - `components/Button/Button.docs.md`
- 로컬 프리뷰 번들 및 정적 페이지 구성:
  - `button-preview-entry.tsx`, `dist/index.html`, `dist/button-preview.js`

### Decisions made
- 토큰 값은 로컬 JSON(`/Users/309agent/Downloads/309-design-tokens.tokens.json`) + Figma MCP에서 추출한 값만 사용하고 임의 값은 배제.
- 스타일 구조는 확장 가능한 semantic 네이밍으로 정리:
  - primitive + semantic 색상 분리
  - 타입/간격/반경/그림자/보더 체계화
- 버튼 구현은 하드코딩 대신 `style-tokens.ts` 값만 참조하도록 유지.
- 버튼 variant 축은 Figma 기준으로 반영:
  - `variant`, `size`, `target`, `state`에 더해 `type`, `shape` 적용
- 네이티브 `<button>`의 `type` 속성과 variant 축 이름 충돌 방지를 위해:
  - variant 축: `type`
  - HTML 속성: `htmlType`
- 5000 포트는 시스템 프로세스(AirTunes)가 점유하여 5001 포트로 프리뷰 서버 운영.

### Tokens created
- 파일: `style-tokens.ts`
- 포함 범주:
  - `colors` (primitive + semantic)
  - `typography` (font family, size, weight, line-height)
  - `spacing`
  - `radius`
  - `shadows`
  - `borders`
  - `zIndex` (정의된 값 범위)
- 스타일 가이드 렌더 페이지: `style-guide.tsx`

### Components created
- `Button` (React + TypeScript)
- 지원 variant 축:
  - `variant`: `primary | secondary | tertiary | ghost | destructivePrimary | destructiveSecondary | destructiveTertiary | destructiveGhost`
  - `size`: `xs | sm | md | lg`
  - `type`: `default | iconOnly`
  - `shape`: `rounded | pill`
- 상태 처리:
  - `default | hover | focus | disabled` (강제 프리뷰용 `forceState` 포함)
- 미리보기:
  - `Button.preview.tsx`에서 variant/size/type/shape/state 인터랙티브 토글 제공

### Next action items
1. 5000 포트를 반드시 써야 하면 시스템 점유 프로세스 해제 후 서버 재기동.
2. Figma 최신 변경과 코드 간 차이(특히 icon-only 치수/간격)를 재검증.
3. Storybook 도입 시 `Button.preview.tsx`를 스토리로 이관해 회귀 테스트 기반 마련.
4. 동일 토큰 체계로 Input/Tag/Chip 등 다음 핵심 컴포넌트 확장.

## Session 2
- Date: 2026-03-03 (Asia/Seoul)

### What was built
- Figma MCP `Navigation Bar`(`Type=01~08`) 구현:
  - `/Users/309agent/cursor/309-design-library/components/NavigationBar/NavigationBar.tsx`
  - `/Users/309agent/cursor/309-design-library/components/NavigationBar/NavigationBar.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/NavigationBar/NavigationBar.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/NavigationBar/NavigationBar.docs.md`

### Decisions made
- 스타일 값은 `style-tokens.ts`의 토큰만 사용.
- `Type=01~08` 레이아웃은 MCP 추출 구조를 기준으로 분기 구현.
- Figma 노드에서 링크별 hover/focus/disabled 별도 variant 축이 확인되지 않아:
  - 기본 시각 유지
  - `focus`는 `shadows.focusRing.light.css`
  - `disabled`는 텍스트/인터랙션 비활성화
- `Type=06` 검색 필드, `Type=07` CTA, `Type=08` 2행 구조(탑/탭)를 Figma 구조대로 반영.

### Tokens created
- 신규 토큰 생성 없음.
- Single Source of Truth 유지:
  - `/Users/309agent/cursor/309-design-library/style-tokens.ts`

### Components created
- `NavigationBar` (React + TypeScript)
- Variant 축:
  - `type`: `01 | 02 | 03 | 04 | 05 | 06 | 07 | 08`
  - `interactionState`: `default | hover | focus | disabled`
- 프리뷰:
  - Type/State/Width/Active tab/Custom links 토글 제공

### Next action items
1. 실제 Figma 인터랙션 프로토타입(hover/focus/disabled)이 추가되면 상태별 시각값을 재매핑.
2. 프리뷰 엔트리 파일에서 `NavigationBar.preview.tsx`를 라우팅해 브라우저 직접 검증.
3. 동일 패턴으로 다음 컴포넌트(Navigation 하위 메뉴/Side Nav) 확장.

## Session 3
- Date: 2026-03-03 (Asia/Seoul)

### What was built
- Figma MCP `Pagination` 기반 `Pagenation` 컴포넌트 구현:
  - `/Users/309agent/cursor/309-design-library/components/Pagenation/Pagenation.tsx`
  - `/Users/309agent/cursor/309-design-library/components/Pagenation/Pagenation.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/Pagenation/Pagenation.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/Pagenation/Pagenation.docs.md`
- 아이콘 에셋 저장:
  - `/Users/309agent/cursor/309-design-library/components/Pagenation/assets/*.svg`

### Decisions made
- 사용자 요청 컴포넌트 명칭(`Pagenation`)을 파일/컴포넌트명에 그대로 반영.
- Figma variant 축:
  - `Type=Arrows|Numbers|Buttons`
  - `Size=md|sm`
- Pagination 노드 내 hover/focus/disabled 시각 variant 축은 확인되지 않아:
  - `focus`는 접근성 focus ring 적용
  - `disabled`는 인터랙션 차단 중심으로 처리
- 스타일 값은 `style-tokens.ts`만 사용.

### Tokens created
- 신규 토큰 생성 없음.
- Single Source of Truth 유지:
  - `/Users/309agent/cursor/309-design-library/style-tokens.ts`

### Components created
- `Pagenation` (React + TypeScript)
- Variant 축:
  - `type`: `arrows | numbers | buttons`
  - `size`: `md | sm`
  - `interactionState`: `default | hover | focus | disabled`

### Next action items
1. Figma에서 Pagination hover/disabled 시각 variant가 추가되면 상태별 토큰 매핑 보강.
2. Preview 엔트리 라우팅에 `Pagenation.preview.tsx`를 연결해 브라우저 즉시 검증 가능 상태로 확장.
3. `Pagenation` 명칭을 `Pagination`으로 정규화할지 팀 컨벤션 확정 후 리네이밍 검토.

## Session 4
- Date: 2026-03-03 (Asia/Seoul)

### What was built
- Figma MCP 기반 `ProgressBar`, `ProgressCircle` 컴포넌트 구현:
  - `/Users/309agent/cursor/309-design-library/components/ProgressBar/ProgressBar.tsx`
  - `/Users/309agent/cursor/309-design-library/components/ProgressBar/ProgressBar.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/ProgressBar/ProgressBar.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/ProgressBar/ProgressBar.docs.md`
  - `/Users/309agent/cursor/309-design-library/components/ProgressCircle/ProgressCircle.tsx`
  - `/Users/309agent/cursor/309-design-library/components/ProgressCircle/ProgressCircle.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/ProgressCircle/ProgressCircle.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/ProgressCircle/ProgressCircle.docs.md`
- ProgressBar 아이콘 에셋 저장:
  - `/Users/309agent/cursor/309-design-library/components/ProgressBar/assets/*.svg`

### Decisions made
- ProgressBar top-level variant는 Figma 노드 기준으로 `Direction × Target`을 기본 축으로 구현.
- Line/Circle 내부 컴포넌트 메타데이터에서 확인된 축을 확장 prop으로 노출:
  - ProgressBar: `size`, `color`, `progressValue`, `shimmering`
  - ProgressCircle: `color`, `progressValue`
- Hover/focus/disabled 시각 상태는 Figma top-level variant에서 직접 확인되지 않아 접근성 중심(`focus ring`, `disabled 대비`)으로 처리.
- 모든 스타일 값은 `style-tokens.ts`에서 참조(숫자 연산 포함).

### Tokens created
- 신규 토큰 생성 없음.
- Single Source of Truth 유지:
  - `/Users/309agent/cursor/309-design-library/style-tokens.ts`

### Components created
- `ProgressBar` (React + TypeScript)
  - main variants: `direction(vertical|horizontal)`, `target(default|destructive)`
  - extended variants: `size(sm|md|lg)`, `color(green|blue|red|orange|purple)`
- `ProgressCircle` (React + TypeScript)
  - main variants: `size(xs|sm|md|lg)`
  - extended variants: `color(green|purple|red)`

### Next action items
1. Line/Circle의 전체 progress preset(0/25/50/75/100 등)을 스토리 단위 snapshot 테스트로 고정.
2. Preview entry 라우팅에 ProgressBar/ProgressCircle 페이지를 연결해 브라우저 즉시 검증 가능하게 확장.
3. 향후 motion 토큰이 정의되면 shimmering/fill transition duration을 토큰 기반으로 치환.

## Session 5
- Date: 2026-03-03 (Asia/Seoul)

### What was built
- Figma MCP 기반 `QuantityStepper` 컴포넌트 구현:
  - `/Users/309agent/cursor/309-design-library/components/QuantityStepper/QuantityStepper.tsx`
  - `/Users/309agent/cursor/309-design-library/components/QuantityStepper/QuantityStepper.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/QuantityStepper/QuantityStepper.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/QuantityStepper/QuantityStepper.docs.md`

### Decisions made
- Figma variant 축:
  - `Size=lg|md`
  - `Shape=Rounded|Pill`
  - `State=Default|Hover|Focused`
- MCP 호출 한도 이슈로 `Focused` 3개 노드(`lg pill`, `md rounded`, `md pill`)의 추가 `get_design_context` 추출은 실패.
  - 이미 확보된 `focused` 스펙(`lg rounded`) + default/hover 패턴 일관성으로 포커스 스타일을 동일 규칙으로 적용.
- 컴포넌트 동작은 production 사용성을 위해 증감/키보드/접근성 로직을 추가.
- 스타일 값은 `style-tokens.ts`만 참조.

### Tokens created
- 신규 토큰 생성 없음.
- Single Source of Truth 유지:
  - `/Users/309agent/cursor/309-design-library/style-tokens.ts`

### Components created
- `QuantityStepper` (React + TypeScript)
- Variant 축:
  - `size`: `lg | md`
  - `shape`: `rounded | pill`
  - `state`: `default | hover | focused | disabled`

### Next action items
1. Figma MCP 호출 한도 복구 후 누락된 focused 3개 variant를 재검증해 픽셀 단위 차이 여부 확인.
2. Preview entry 라우팅에 `QuantityStepper.preview.tsx` 연결.
3. Interaction 상태별 시각 리그레션 스냅샷 추가.

## Session 6
- Session number: 6
- Date: 2026-03-04 (Asia/Seoul)

### What was built
- Figma MCP 기반 `TableCell`, `TableHeader` 컴포넌트 구현:
  - `/Users/309agent/cursor/309-design-library/components/TableCell/TableCell.tsx`
  - `/Users/309agent/cursor/309-design-library/components/TableCell/TableCell.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/TableCell/TableCell.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/TableCell/TableCell.docs.md`
  - `/Users/309agent/cursor/309-design-library/components/TableHeader/TableHeader.tsx`
  - `/Users/309agent/cursor/309-design-library/components/TableHeader/TableHeader.types.ts`
  - `/Users/309agent/cursor/309-design-library/components/TableHeader/TableHeader.preview.tsx`
  - `/Users/309agent/cursor/309-design-library/components/TableHeader/TableHeader.docs.md`
- 빌드 검증:
  - `esbuild`로 `TableCell/TableHeader` 본체 + preview 번들링 성공.

### Decisions made
- `TableCell`는 Figma variant 축 `Type × Size × Direction` 전체를 typed props로 구현.
- `TableHeader`는 Figma variant 축 `Direction`을 기준으로 구현.
- `TableCell`/`TableHeader`에서 `hover/focus/disabled`가 top-level variant 축으로 정의되지 않은 부분은 접근성/제어형 동작 중심으로 처리.
- MCP 호출 한도 도달로 `TableHeader` Right 단일 노드 재조회는 실패했으나, Left/Center 추출 구조와 metadata 정렬 규칙을 근거로 `Right = justify-end`로 반영.
- 모든 스타일 값은 `style-tokens.ts` 토큰만 사용(하드코딩 배제).

### Tokens created
- 신규 토큰 생성 없음.
- Single Source of Truth 유지:
  - `/Users/309agent/cursor/309-design-library/style-tokens.ts`

### Components created
- `TableCell` (React + TypeScript)
  - `type`: `leadPrimary | text | button | circleCheckbox | checkbox | radioButton | buttonGroup | toggle | badge | badgeGroup | avatar | avatarGroup | progress | chart`
  - `size`: `lg | md | sm`
  - `direction`: `left | center | right`
- `TableHeader` (React + TypeScript)
  - `direction`: `left | center | right`

### Next action items
1. MCP 한도 복구 후 `TableHeader` Right 노드를 재추출해 픽셀 단위 차이 재검증.
2. 프리뷰 엔트리 라우팅(`button-preview-entry.tsx`)에 `TableCell.preview.tsx`, `TableHeader.preview.tsx` 연결.
3. 추후 `Table` 상위 컴포넌트 구현 시 헤더-셀 조합 스냅샷 테스트(정렬/폭/상태) 추가.
