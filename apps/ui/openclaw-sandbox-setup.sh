#!/usr/bin/env bash
set -euo pipefail

# Ensure Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop이 꺼져 있습니다. 먼저 실행해주세요." >&2
  exit 1
fi

if docker images | grep -q "openclaw-sandbox:local"; then
  echo "이미 openclaw-sandbox:local 이미지가 존재합니다."
  exit 0
fi

echo "샌드박스 이미지를 빌드합니다..."
cd /Users/a309/workspace/.openclaw

docker build -t openclaw-sandbox:local -f Dockerfile.sandbox .

echo "완료."
