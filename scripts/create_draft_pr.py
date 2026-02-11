#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import urllib.request


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd="/workspace", text=True).strip()


def load_repo_info():
    path = "/workspace/PROJECT_REPO.json"
    if not os.path.exists(path):
        return {"origin": "", "owner": "", "repo": ""}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_origin(repo_info):
    origin = ""
    try:
        origin = git("remote", "get-url", "origin")
    except Exception:
        origin = repo_info.get("origin", "")
        if origin:
            git("remote", "add", "origin", origin)
    return origin


def ensure_pushed(branch: str):
    git("push", "-u", "origin", branch)


if len(sys.argv) >= 6:
    owner, repo, base, head, title = sys.argv[1:6]
    body = sys.argv[6] if len(sys.argv) > 6 else ""
else:
    repo_info = load_repo_info()
    owner = repo_info.get("owner", "")
    repo = repo_info.get("repo", "")
    if not owner or not repo:
        print("Missing repo info (owner/repo).", file=sys.stderr)
        sys.exit(1)
    base = os.environ.get("BASE_BRANCH", "main")
    head = os.environ.get("HEAD_BRANCH", "") or git("rev-parse", "--abbrev-ref", "HEAD")
    title = os.environ.get("PR_TITLE", "") or git("log", "-1", "--pretty=%s")
    body = os.environ.get("PR_BODY", "")

    ensure_origin(repo_info)
    ensure_pushed(head)

token_path = "/workspace/.secrets/github.token"

token = os.environ.get("GITHUB_TOKEN", "")
if not token and os.path.exists(token_path):
    with open(token_path, "r", encoding="utf-8") as f:
        token = f.read().strip()

if not token:
    print("Missing GitHub token", file=sys.stderr)
    sys.exit(1)

url = f"https://api.github.com/repos/{owner}/{repo}/pulls"

payload = {
    "title": title,
    "head": head,
    "base": base,
    "body": body,
    "draft": True,
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "openclaw-devloop",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
        print(data.get("html_url", ""))
except Exception as e:
    print(str(e), file=sys.stderr)
    sys.exit(1)
