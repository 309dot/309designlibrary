#!/usr/bin/env python3
import sys
from pathlib import Path

inbox = Path("/workspace/tasks/inbox")
if not inbox.exists():
    sys.exit(2)

files = [p for p in inbox.glob("*.md") if p.is_file()]
if not files:
    sys.exit(2)

files.sort(key=lambda p: p.stat().st_mtime)
print(str(files[0]))
