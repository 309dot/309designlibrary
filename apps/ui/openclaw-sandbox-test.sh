#!/usr/bin/env bash
set -euo pipefail

docker run --rm openclaw-sandbox:local /bin/sh -lc 'id && node -v && pnpm -v'
