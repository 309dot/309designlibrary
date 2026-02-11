# 작업 인박스 안내

이 폴더는 OpenClaw 자동 개발 루프의 입력/상태/로그를 관리합니다.

## 디렉토리 구조
- inbox: 신규 작업 .md 파일을 넣는 곳
- processing: 처리 중 작업
- done: 완료 작업
- failed: 실패(Review Required) 작업
- logs: 상태 전환 로그 및 테스트 로그

## 작업 파일 형식
파일명 예시: 20260211-login-button.md

파일 내용 예시:

title: 로그인 버튼 스타일 수정
repo: /workspace
base_branch: main
# tests는 생략 가능 (PROJECT_TESTS.json 사용)
tests: pnpm test
acceptance:
- 버튼 색상이 토큰 색상으로 변경됨
- 스냅샷 테스트 통과

## 주의
- 파일은 UTF-8로 작성하세요.
- acceptance는 불릿으로 작성하는 것을 권장합니다.
