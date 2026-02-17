# 309Agent 웹 하이브리드 배포

## 목표
- 프론트(UI)는 웹에 배포
- 실행 런타임(OpenClaw/Ollama/로컬 파일)은 Mac mini 로컬 유지

## 구조
1. `apps/ui` 프론트 빌드를 Vercel에 배포
2. 로컬 `http://127.0.0.1:4310` 서버를 Cloudflare Tunnel로 외부 노출
3. Tunnel 도메인(`https://api.309agent.<domain>`)을 Cloudflare Access(GitHub OAuth)로 보호
4. 웹 프론트에서 `VITE_API_BASE_URL=https://api.309agent.<domain>` 설정

## 필수 환경변수
- 프론트(Vercel)
  - `VITE_API_BASE_URL=https://api.309agent.<domain>`
- 로컬 서버(`apps/ui/server/index.mjs`)
  - `CORS_ORIGINS=https://<your-vercel-domain>,https://309agnet.vercel.app`
  - `DEFAULT_PERMISSION=full` (기본 권한)

## 보안 기본
- permission `full`은 승인 게이트만 우회하며, 샌드박스 정책은 유지
- 인증 없는 외부 접근은 Cloudflare Access에서 차단
- API 서버는 CORS allowlist 외 origin 차단

## 확인 체크
1. 웹에서 접속 후 채팅 전송
2. 로컬 `4310`에서 run/session 생성 확인
3. 코드 작업 후 verify stdout/stderr/exitCode 기록 확인
4. done 메시지에 변경 파일 요약(Top 10) 표시 확인
