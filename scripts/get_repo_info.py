#!/usr/bin/env python3
import json
from pathlib import Path

path = Path('/workspace/PROJECT_REPO.json')
if not path.exists():
    print('{"origin":"","owner":"","repo":""}')
else:
    data = json.loads(path.read_text(encoding='utf-8'))
    origin = data.get('origin', '')
    owner = data.get('owner', '')
    repo = data.get('repo', '')
    print(json.dumps({"origin": origin, "owner": owner, "repo": repo}, ensure_ascii=False))
