당신은 로컬 OpenClaw 에이전트이며, 이 작업은 /workspace 루트에서만 수행해야 합니다.
외부 AI API는 사용하지 말고, 로컬 Ollama만 사용합니다.

목표: shadcn/ui 스타일의 컴포넌트 시스템을 모노레포로 구축한다.
- 토큰 소스: /workspace/tokens.json
- 스택: React + Tailwind + Radix
- 레포 구조: packages/tokens, packages/ui, apps/docs, registry
- 문서: Next.js 기반
- 레지스트리: shadcn registry.json 스키마 준수
- 컴포넌트 범위: 50+ (가능한 최대 수)
- 결과: 로컬 git init (push 금지)

필수 규칙:
1) 작업은 /workspace 내부에서만 수행한다.
2) 네트워크는 npm/GitHub 패키지 설치에만 사용한다.
3) 실패하면 원인 기록 후 가능한 범위까지 진행한다.
4) 마지막에 /workspace/BUILD_SUMMARY.md 작성.

=== 작업 단계 ===
1. 저장소 초기화
- /workspace 에서 git init
- README.md, LICENSE(MIT) 기본 작성

2. pnpm 모노레포 스캐폴드
- corepack enable
- pnpm 사용
- 루트에 pnpm-workspace.yaml 생성
- 루트 package.json에 workspaces, scripts, prettier/eslint 최소 설정

3. tokens 패키지
- packages/tokens
- Style Dictionary + @tokens-studio/sd-transforms 사용
- tokens.json 로드 → CSS 변수, TS 토큰, Tailwind 토큰 생성
- 출력 경로:
  - packages/tokens/dist/css/variables.css
  - packages/tokens/dist/tailwind/tokens.ts
  - packages/tokens/dist/tokens.json
- packages/tokens/package.json 및 build 스크립트 구성

4. ui 패키지
- packages/ui
- React + Tailwind + Radix UI
- cn 유틸리티 추가
- tokens 패키지의 CSS 변수 참조
- 최소 50+ 컴포넌트 생성 (가능한 최대치)
- 컴포넌트 예시: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Card, Tabs, Dialog, Drawer, Popover, Tooltip, Toast, Table, Dropdown, Menu, Pagination, Breadcrumb 등

5. docs 앱
- apps/docs (Next.js)
- UI 컴포넌트 예제 페이지, 토큰 페이지 생성
- packages/ui와 packages/tokens를 사용하도록 설정
- docs에서 registry JSON을 정적 서빙하도록 구성

6. registry
- /workspace/registry/registry.json 생성 (shadcn 스키마)
- 각 컴포넌트별 registry item json 생성

7. 빌드/검증
- pnpm install
- pnpm tokens:build
- pnpm ui:build (가능한 경우)
- 오류 발생 시 로그에 기록

8. 요약
- /workspace/BUILD_SUMMARY.md 작성
  - 수행한 명령
  - 생성된 주요 파일
  - 실패/이슈

=== 주의사항 ===
- 절대 /workspace 바깥을 건드리지 말 것
- 테스트/빌드가 실패하면 그 시점까지의 작업을 유지하고 요약에 기록

작업을 시작하라.
