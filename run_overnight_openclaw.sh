#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/Users/a309/Documents/Agent309/wOpenclaw"
PROMPT_FILE="$WORKSPACE/overnight_openclaw_prompt.md"
CONFIG="/Users/a309/.openclaw/openclaw.json"
BACKUP="/Users/a309/.openclaw/openclaw.json.bak-$(date +%Y%m%d%H%M%S)"
LOG="$WORKSPACE/OVERNIGHT_RUN_$(date +%Y%m%d%H%M%S).log"

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file missing: $PROMPT_FILE" >&2
  exit 1
fi

cp "$CONFIG" "$BACKUP"

restore_config() {
  if [[ -f "$BACKUP" ]]; then
    cp "$BACKUP" "$CONFIG"
    /Users/a309/.openclaw/bin/openclaw gateway restart >/dev/null 2>&1 || true
    /Users/a309/.openclaw/bin/openclaw sandbox recreate --all --force >/dev/null 2>&1 || true
  fi
}
trap restore_config EXIT

python3 - <<'PY'
import json
from pathlib import Path

config_path = Path('/Users/a309/.openclaw/openclaw.json')
workspace = '/Users/a309/Documents/Agent309/wOpenclaw'

data = json.loads(config_path.read_text(encoding='utf-8'))

data.setdefault('agents', {}).setdefault('defaults', {})

# Set workspace to target repo

data['agents']['defaults']['workspace'] = workspace

# Ensure sandbox settings
sandbox = data['agents']['defaults'].setdefault('sandbox', {})
sandbox['mode'] = sandbox.get('mode', 'all')
sandbox['workspaceAccess'] = 'rw'

# Docker settings

docker = sandbox.setdefault('docker', {})
docker['workdir'] = '/workspace'
docker['network'] = 'bridge'
docker['binds'] = [f"{workspace}:/workspace:rw"]

config_path.write_text(json.dumps(data, ensure_ascii=False, indent=2))
PY

/Users/a309/.openclaw/bin/openclaw gateway restart
/Users/a309/.openclaw/bin/openclaw sandbox recreate --all --force

/Users/a309/.openclaw/bin/openclaw agent \
  --session-id overnight-design-system \
  --message "$(cat "$PROMPT_FILE")" \
  --json \
  > "$LOG" 2>&1 || true

echo "DONE. Log: $LOG"
