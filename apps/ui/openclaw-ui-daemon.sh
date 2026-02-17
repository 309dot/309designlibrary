#!/usr/bin/env bash
set -euo pipefail

USER_HOME="/Users/a309"
WORKDIR="/Users/a309/Documents/Agent309/wOpenclaw/apps/ui"
LOG_DIR="/Users/a309/Library/Application Support/OpenClawUI/logs"

export HOME="$USER_HOME"
mkdir -p "$LOG_DIR"

VOLTA_HOME="${VOLTA_HOME:-$USER_HOME/.volta}"
resolve_volta_node() {
  local latest=""
  latest="$(ls -1d "$VOLTA_HOME"/tools/image/node/* 2>/dev/null | sort -V | tail -n 1 || true)"
  if [[ -n "$latest" && -x "$latest/bin/node" ]]; then
    echo "$latest/bin/node"
    return 0
  fi
  echo "$USER_HOME/.volta/bin/node"
}
resolve_volta_pnpm() {
  local latest=""
  latest="$(ls -1d "$VOLTA_HOME"/tools/image/packages/pnpm/* 2>/dev/null | sort -V | tail -n 1 || true)"
  if [[ -n "$latest" && -x "$latest/bin/pnpm" ]]; then
    echo "$latest/bin/pnpm"
    return 0
  fi
  echo "$USER_HOME/.volta/bin/pnpm"
}
NODE_BIN="$(resolve_volta_node)"
PNPM_BIN="$(resolve_volta_pnpm)"
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

echo "[$(date '+%Y-%m-%d %H:%M:%S')] start ui server" >> "$LOG_DIR/ui-launcher.log"
exec "$NODE_BIN" "$WORKDIR/server/index.mjs" >> "$LOG_DIR/ui-launcher.log" 2>&1
