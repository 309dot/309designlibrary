# OpenClaw Agent

This is an AI agent that runs locally on your machine.

## Getting Started

1. **Run the agent**: 
   ```bash
   npm start
   ```

2. **Task Inbox**
   - Tasks are placed in `/workspace/tasks/inbox`
   - The agent will automatically process new tasks

## Project Overview

This project is an AI agent designed to run locally on your machine. It handles automated tasks through a simple workflow:

- Tasks are placed in the inbox directory
- The agent automatically processes new tasks
- Each task is executed in isolation on a dedicated branch
- Completed tasks are merged back into the main branch

## 디자인 토큰 빌드

`tokens.json`을 CSS 변수/TS 상수로 변환합니다.

```bash
python3 /Users/a309/Documents/Agent309/wOpenclaw/scripts/build_tokens.py
```

출력 경로:
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/tokens/src/tokens.css`
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/tokens/src/tokens.ts`
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/tokens/src/tokens.cleaned.json`

## UI 컴포넌트

기본 컴포넌트: Button, Badge, Tag

경로:
- `/Users/a309/Documents/Agent309/wOpenclaw/packages/ui/src`

## Showcase

```bash
cd /Users/a309/Documents/Agent309/wOpenclaw
python3 -m http.server 8000
```

브라우저:
`http://localhost:8000/apps/showcase/index.html`
