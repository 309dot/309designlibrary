#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if not path or not path.exists():
    print("{}")
    sys.exit(1)

text = path.read_text(encoding="utf-8")
lines = text.splitlines()
meta = {}
acceptance = []

in_acceptance = False
for line in lines:
    raw = line.strip()
    if not raw:
        if in_acceptance:
            continue
        else:
            continue
    if re.match(r"^acceptance\s*:\s*$", raw, re.I):
        in_acceptance = True
        continue
    if in_acceptance:
        if raw.startswith("-"):
            acceptance.append(raw.lstrip("- ").strip())
        continue
    if ":" in raw:
        key, val = raw.split(":", 1)
        meta[key.strip().lower()] = val.strip()

result = {
    "title": meta.get("title", ""),
    "repo": meta.get("repo", "/workspace"),
    "base_branch": meta.get("base_branch", "main"),
    "tests": meta.get("tests", ""),
    "acceptance": acceptance,
}
print(json.dumps(result, ensure_ascii=False))
