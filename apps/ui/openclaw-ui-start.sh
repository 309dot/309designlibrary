#!/usr/bin/env bash
set -euo pipefail

USER_HOME="/Users/a309"
WORKDIR="/Users/a309/Documents/Agent309/wOpenclaw/apps/ui"
LOG_DIR="$WORKDIR/.data"

export HOME="$USER_HOME"
mkdir -p "$LOG_DIR"

NODE_BIN="$USER_HOME/.volta/bin/node"
PNPM_BIN="$USER_HOME/.volta/bin/pnpm"
VITE_BIN="$WORKDIR/node_modules/vite/bin/vite.js"
DIST_INDEX="$WORKDIR/dist/index.html"

if [[ ! -x "$NODE_BIN" ]]; then
  echo "node 실행 파일이 없습니다: $NODE_BIN" >&2
  exit 1
fi
if [[ ! -x "$PNPM_BIN" ]]; then
  echo "pnpm 실행 파일이 없습니다: $PNPM_BIN" >&2
  exit 1
fi

cd "$WORKDIR"

if [[ ! -f "$DIST_INDEX" ]]; then
  if [[ -x "$VITE_BIN" ]]; then
    "$NODE_BIN" "$VITE_BIN" build >> "$LOG_DIR/ui-build.log" 2>&1
  else
    "$PNPM_BIN" build >> "$LOG_DIR/ui-build.log" 2>&1
  fi
fi

if lsof -nP -iTCP:4310 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "4310 포트에서 이미 실행 중입니다."
else
  nohup "$NODE_BIN" "$WORKDIR/server/index.mjs" > "$LOG_DIR/ui-launcher.log" 2>&1 < /dev/null &
fi

sleep 1
open "http://localhost:4310"
