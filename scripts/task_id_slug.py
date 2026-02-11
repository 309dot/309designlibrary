#!/usr/bin/env python3
import re
import sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if not path:
    sys.exit(1)

name = path.name
stem = name.rsplit(".", 1)[0]

if "-" in stem:
    task_id, slug_raw = stem.split("-", 1)
else:
    task_id, slug_raw = stem, stem

slug = re.sub(r"[^a-zA-Z0-9]+", "-", slug_raw).strip("-").lower()
print(f"{task_id}|{slug}")
