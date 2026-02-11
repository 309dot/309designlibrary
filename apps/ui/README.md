# OpenClaw Command UI

로컬 OpenClaw에 프롬프트를 보내고 실행 로그를 확인하는 UI입니다.

## 가장 간단한 실행 방법 (앱처럼)

아래 둘 중 하나만 실행하면 됩니다.

1) **OpenClaw UI.app** 더블 클릭
- 경로: `/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/OpenClaw UI.app`

2) **OpenClawUI.command** 더블 클릭
- 경로: `/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/OpenClawUI.command`

실행 후 브라우저가 자동으로 열립니다:
```
http://localhost:4310
```

## 로그인 시 자동 실행 (설정 완료)

로그인하면 자동으로 OpenClaw UI.app이 실행되도록 등록했습니다.
끄고 싶으면 아래 스크립트를 실행하세요.

```bash
/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/openclaw-ui-login-disable.sh
```

다시 켜고 싶으면:

```bash
/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/openclaw-ui-login-enable.sh
```

## 메뉴바 제어 (SwiftBar)

메뉴바에 **OpenClaw UI 상태/시작/중지**가 표시됩니다.

- 설치 위치: `/Applications/SwiftBar.app`
- 플러그인: `~/Library/Application Support/SwiftBar/Plugins/openclaw-ui.1m.sh`

SwiftBar가 처음 실행되면 권한 요청이 뜰 수 있습니다. 허용해 주세요.

## 수동 실행 방법

```bash
/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/openclaw-ui-start.sh
```

## 샌드박스 이미지(도커) 준비

OpenClaw가 "Sandbox image not found"를 내면 아래 스크립트를 한번 실행하세요.

```bash
/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/openclaw-sandbox-setup.sh
```

## 종료

```bash
/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/openclaw-ui-stop.sh
```

## 기본 설정

- UI: `http://localhost:4310`
- API: `http://localhost:4310/api/*`
- 로그: `/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/.data`

