#!/usr/bin/env python3
import re
import sys
from pathlib import Path

# 기본은 가벼운 모델, 개발/원인 분석은 중간, 장문 설계는 큰 모델.
DEFAULT = "qwen2.5:7b"
DEV = "qwen2.5:14b"
LONG = "qwen2.5:32b"

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
    # task inbox는 개발 루프 신뢰성이 중요하므로 coder 모델 우선
    if "/tasks/inbox/" in str(task_path):
        print("qwen3-coder:30b")
        return
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
