# Evals (309Agent)

이 폴더는 309Agent의 자동 에이전트 성능을 **기계적으로 판정**하기 위한 시나리오/러너를 포함합니다.

- 시나리오: `scripts/evals/scenarios/*.json`
- 실행: `node scripts/evals/run_evals.mjs`
- 출력: `apps/ui/.data/evals/YYYY-MM-DD.json` (gitignore)

주의:
- `code` 시나리오는 `workspace/__eval__/` 아래에서만 파일을 만들도록 구성합니다(리포지토리 오염 방지).
- 외부 네트워크/배포/머지/푸시 같은 위험 작업은 시나리오에 포함하지 않습니다.

