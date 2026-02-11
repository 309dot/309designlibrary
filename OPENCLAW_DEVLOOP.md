# OpenClaw 자동 개발 루프

이 문서는 OpenClaw가 작업을 자동으로 수행하는 개발 루프 사용법을 설명합니다.

## 1) 작업 넣기
- `/workspace/tasks/inbox`에 `.md` 파일을 넣으면 처리됩니다.
- 예시 파일명: `20260211-login-button.md`

예시 내용:

title: 로그인 버튼 스타일 수정
repo: /workspace
base_branch: main
# tests는 생략 가능 (PROJECT_TESTS.json 사용)
tests: pnpm test
acceptance:
- 버튼 색상이 토큰 색상으로 변경됨
- 스냅샷 테스트 통과

## 2) 테스트 명령 규칙
- `/workspace/PROJECT_TESTS.json`에 기본 테스트 명령을 정의합니다.

## 3) GitHub 설정
- `/workspace/PROJECT_REPO.json`에 origin/owner/repo를 입력합니다.
- `/workspace/.secrets/github.token`에 GitHub PAT를 저장합니다.
- 토큰 권한: `repo` 필요

## 4) 실행
- 단발 실행:
  - `/workspace/run_openclaw_task_loop.sh`
- 실행 로그:
  - `/workspace/tasks/logs/run-YYYYMMDDHHMMSS.log`
- 상태 로그:
  - `/workspace/tasks/logs/<task-id>.json`

## 5) 상태 머신
- Lead → Planning → In Progress → Testing → Review Required/Completed
- 각 전환은 JSON 로그에 기록됩니다.

## 6) 주의
- `/workspace` 외부 접근 금지
- 네트워크는 npm/GitHub만 사용
- 테스트 실패는 최대 3회 재시도
