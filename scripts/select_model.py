#!/usr/bin/env python3
import re
import sys
from pathlib import Path

# Dev loop requires tool-calling; qwen3-coder:30b passes tool-call tests.
DEFAULT = "qwen3-coder:30b"
DEV = "qwen3-coder:30b"
LONG = "qwen3-coder:30b"

KEYWORDS_DEV = {
    "bug",
    "error",
    "fail",
    "test",
    "fix",
    "refactor",
    "trace",
    "stack",
    "regression",
    "performance",
}

KEYWORDS_LONG = {
    "design",
    "spec",
    "architecture",
    "longform",
    "roadmap",
    "proposal",
    "system",
}


def read_task(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def pick(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in KEYWORDS_DEV):
        return DEV
    if any(word in lowered for word in KEYWORDS_LONG):
        return LONG
    return DEFAULT


def main() -> None:
    if len(sys.argv) < 2:
        print(DEFAULT)
        return

    task_path = Path(sys.argv[1])
    content = read_task(task_path)
    if not content:
        print(DEFAULT)
        return

    # Prefer title line if present.
    title_match = re.search(r"^title:\s*(.+)$", content, re.MULTILINE | re.IGNORECASE)
    text = title_match.group(1) if title_match else content
    print(pick(text))


if __name__ == "__main__":
    main()
