#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/Users/a309/Documents/Agent309/wOpenclaw"
STATE_DIR="$WORKSPACE/.openclaw-state"
CONFIG_PATH="$STATE_DIR/openclaw.json"
PROMPT_FILE="$WORKSPACE/openclaw_task_loop_prompt.md"
LOG_DIR="$WORKSPACE/tasks/logs"
LOG_FILE="$LOG_DIR/run-$(date +%Y%m%d%H%M%S).log"
GATEWAY_PORT=19011
SELECTED_TASK_FILE="$WORKSPACE/tasks/.selected"
TEMP_CONFIG_PATH=""

mkdir -p "$LOG_DIR"

if [[ ! -f "$CONFIG_PATH" ]]; then
  echo "Missing config: $CONFIG_PATH" >&2
  exit 1
fi
if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Missing prompt: $PROMPT_FILE" >&2
  exit 1
fi

export OPENCLAW_STATE_DIR="$STATE_DIR"

TASK_PATH_HOST="$(
  python3 - <<'PY'
from pathlib import Path
inbox = Path("/Users/a309/Documents/Agent309/wOpenclaw/tasks/inbox")
files = [p for p in inbox.glob("*.md") if p.is_file()]
if not files:
    raise SystemExit(2)
files.sort(key=lambda p: p.stat().st_mtime)
print(str(files[0]))
PY
  2>/dev/null || true
)"
if [[ -z "${TASK_PATH_HOST:-}" ]]; then
  echo "No tasks."
  exit 0
fi

TASK_BASENAME="$(basename "$TASK_PATH_HOST")"
TASK_PATH_SANDBOX="/workspace/tasks/inbox/$TASK_BASENAME"
echo "$TASK_PATH_SANDBOX" > "$SELECTED_TASK_FILE"

MODEL_ID="$("$WORKSPACE/scripts/select_model.py" "$TASK_PATH_HOST" 2>/dev/null || true)"
if [[ -z "${MODEL_ID:-}" ]]; then
  MODEL_ID="qwen2.5:7b"
fi

TEMP_CONFIG_PATH="$STATE_DIR/openclaw.tmp.$(date +%Y%m%d%H%M%S).json"
MODEL_ID="$MODEL_ID" CONFIG_PATH="$CONFIG_PATH" TEMP_CONFIG_PATH="$TEMP_CONFIG_PATH" python3 - <<'PY'
import json
import os

config_path = os.environ["CONFIG_PATH"]
temp_path = os.environ["TEMP_CONFIG_PATH"]
model_id = os.environ["MODEL_ID"]

with open(config_path, "r", encoding="utf-8") as f:
    cfg = json.load(f)

cfg.setdefault("agents", {}).setdefault("defaults", {}).setdefault("model", {})
cfg["agents"]["defaults"]["model"]["primary"] = f"ollama/{model_id}"

with open(temp_path, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2)
PY

export OPENCLAW_CONFIG_PATH="$TEMP_CONFIG_PATH"

# Start gateway in background
/Users/a309/.openclaw/bin/openclaw gateway --port "$GATEWAY_PORT" --bind loopback >"$LOG_DIR/gateway-$(date +%Y%m%d%H%M%S).log" 2>&1 &
GATEWAY_PID=$!

# Give gateway time to start
sleep 2

# Run agent once
/Users/a309/.openclaw/bin/openclaw agent \
  --session-id devloop \
  --message "$(cat "$PROMPT_FILE")" \
  --json \
  > "$LOG_FILE" 2>&1 || true

# Stop gateway
kill "$GATEWAY_PID" >/dev/null 2>&1 || true

cleanup_file() {
  local target="$1"
  if [[ -z "$target" ]]; then
    return 0
  fi
  if command -v trash >/dev/null 2>&1; then
    trash "$target" >/dev/null 2>&1 || true
  else
    rm -f "$target" >/dev/null 2>&1 || true
  fi
}

cleanup_file "$TEMP_CONFIG_PATH"
cleanup_file "$SELECTED_TASK_FILE"

echo "DONE. Log: $LOG_FILE"
