#!/usr/bin/env bash
set -euo pipefail

APP_PATH="/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/OpenClaw UI.app"

/usr/bin/osascript <<SCRIPT
try
  tell application "System Events"
    if (exists login item "OpenClaw UI") then
      delete login item "OpenClaw UI"
    end if
    make login item at end with properties {path:"${APP_PATH}", hidden:true}
  end tell
end try
SCRIPT

