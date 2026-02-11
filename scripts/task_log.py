#!/usr/bin/env python3
import argparse
import json
from datetime import datetime
from pathlib import Path

def now_iso():
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

def log_path(task_id):
    base = Path("/workspace/tasks/logs")
    base.mkdir(parents=True, exist_ok=True)
    return base / f"{task_id}.json"

def load(task_id):
    path = log_path(task_id)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None

def save(task_id, data):
    path = log_path(task_id)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2))


def cmd_init(args):
    if load(args.task_id):
        return
    data = {
        "taskId": args.task_id,
        "title": args.title,
        "createdAt": now_iso(),
        "transitions": []
    }
    save(args.task_id, data)


def cmd_transition(args):
    data = load(args.task_id)
    if not data:
        data = {
            "taskId": args.task_id,
            "title": args.title or "",
            "createdAt": now_iso(),
            "transitions": []
        }
    entry = {
        "from": args.from_state,
        "to": args.to_state,
        "at": now_iso(),
        "summary": args.summary or "",
        "artifacts": args.artifact or []
    }
    data["transitions"].append(entry)
    save(args.task_id, data)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init")
    p_init.add_argument("--task-id", required=True)
    p_init.add_argument("--title", required=True)
    p_init.set_defaults(func=cmd_init)

    p_tr = sub.add_parser("transition")
    p_tr.add_argument("--task-id", required=True)
    p_tr.add_argument("--from", dest="from_state", required=True)
    p_tr.add_argument("--to", dest="to_state", required=True)
    p_tr.add_argument("--summary", default="")
    p_tr.add_argument("--artifact", action="append")
    p_tr.add_argument("--title", default="")
    p_tr.set_defaults(func=cmd_transition)

    args = p.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
