#!/usr/bin/env python3
import sys
import time
from pathlib import Path

base = Path("/workspace/tasks/logs")
if not base.exists():
    sys.exit(0)

cutoff_days = int(sys.argv[1]) if len(sys.argv) > 1 else 90
cutoff = time.time() - (cutoff_days * 86400)

for path in base.glob("**/*"):
    if not path.is_file():
        continue
    if path.stat().st_mtime < cutoff:
        try:
            path.unlink()
        except Exception:
            pass
