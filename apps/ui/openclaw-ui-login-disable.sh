#!/usr/bin/env bash
set -euo pipefail

/usr/bin/osascript <<'SCRIPT'
try
  tell application "System Events"
    if (exists login item "OpenClaw UI") then
      delete login item "OpenClaw UI"
    end if
  end tell
end try
SCRIPT
