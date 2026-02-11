#!/usr/bin/env bash
set -euo pipefail

# Stop UI (Vite) and API server by port
for port in 5173 4310; do
  pid=$(lsof -nP -t -iTCP:${port} -sTCP:LISTEN || true)
  if [[ -n "$pid" ]]; then
    kill "$pid" || true
  fi
done

