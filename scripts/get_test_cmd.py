#!/usr/bin/env python3
import json
import sys
from pathlib import Path

repo = sys.argv[1] if len(sys.argv) > 1 else "/workspace"
conf_path = Path("/workspace/PROJECT_TESTS.json")

if not conf_path.exists():
    print("pnpm test")
    sys.exit(0)

conf = json.loads(conf_path.read_text(encoding="utf-8"))
paths = conf.get("paths", {})
if repo in paths:
    print(paths[repo])
else:
    print(conf.get("default", "pnpm test"))
