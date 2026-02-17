import fsp from "fs/promises";
import path from "path";
import { spawn, execFile } from "child_process";

const WORKSPACE = process.env.WORKSPACE ?? "/Users/a309/Documents/Agent309/wOpenclaw";
const BASE_URL = process.env.SELF_IMPROVE_BASE_URL ?? "http://localhost:4310";
const TOP_N = Number(process.env.SELF_IMPROVE_TOP_N ?? 3) || 3;
const CREATE_PR = String(process.env.SELF_IMPROVE_CREATE_PR ?? "1") !== "0";
const PERMISSION = String(process.env.SELF_IMPROVE_PERMISSION ?? "basic") === "full" ? "full" : "basic";

const OUT_DIR = path.join(WORKSPACE, "apps/ui/.data/self-improve");
const EVAL_OUT = path.join(WORKSPACE, "apps/ui/.data/evals");
const METRICS_OUT = path.join(WORKSPACE, "apps/ui/.data/metrics");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isoDay = () => new Date().toISOString().slice(0, 10);

const exec = (cmd, args, opts = {}) =>
  new Promise((resolve) => {
    execFile(cmd, args, opts, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout?.toString() ?? "",
        stderr: stderr?.toString() ?? ""
      });
    });
  });

const fetchJson = async (url, init = {}) => {
  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
};

const runNode = async (scriptPath, env = {}) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: WORKSPACE,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"]
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => resolve({ ok: code === 0, code, stdout: out, stderr: err }));
  });

const ALLOWED_PREFIXES = ["apps/ui/", "scripts/", "docs/"];
const ALLOWED_FILES = new Set(["verify.recipe.json"]);

const normalizePathFromPorcelain = (line) => {
  // porcelain v1: XY<space>path OR XY<space>old -> new
  const raw = String(line ?? "").slice(3).trim();
  if (!raw) return "";
  const parts = raw.split(" -> ");
  return (parts[parts.length - 1] || "").trim();
};

const listDirtyPaths = async () => {
  const st = await exec("git", ["-C", WORKSPACE, "status", "--porcelain"]);
  if (!st.ok) return { ok: false, reason: "git_status_failed", paths: [] };
  const paths = st.stdout
    .split("\n")
    .map((l) => l.trimEnd())
    .filter(Boolean)
    .map(normalizePathFromPorcelain)
    .filter(Boolean);
  return { ok: true, paths };
};

const isAllowedPath = (p) => {
  if (!p) return false;
  if (ALLOWED_FILES.has(p)) return true;
  return ALLOWED_PREFIXES.some((prefix) => p.startsWith(prefix));
};

const getCurrentBranch = async () => {
  const r = await exec("git", ["-C", WORKSPACE, "rev-parse", "--abbrev-ref", "HEAD"]);
  if (!r.ok) return { ok: false, branch: "" };
  return { ok: true, branch: r.stdout.trim() || "" };
};

const getTopStashRef = async () => {
  const r = await exec("git", ["-C", WORKSPACE, "stash", "list", "-n", "1", "--pretty=%gd"]);
  if (!r.ok) return "";
  return r.stdout.trim() || "";
};

const stashAll = async (message) => {
  const r = await exec("git", ["-C", WORKSPACE, "stash", "push", "-u", "-m", message]);
  if (!r.ok) return { ok: false, stdout: r.stdout, stderr: r.stderr };
  const ref = await getTopStashRef();
  return { ok: true, ref };
};

const stashPaths = async ({ message, paths }) => {
  if (!Array.isArray(paths) || paths.length === 0) return { ok: true, ref: "" };
  const r = await exec("git", ["-C", WORKSPACE, "stash", "push", "-u", "-m", message, "--", ...paths]);
  if (!r.ok) return { ok: false, stdout: r.stdout, stderr: r.stderr };
  const ref = await getTopStashRef();
  return { ok: true, ref };
};

const applyStash = async (ref) => {
  if (!ref) return { ok: true };
  return exec("git", ["-C", WORKSPACE, "stash", "apply", ref]);
};

const dropStash = async (ref) => {
  if (!ref) return { ok: true };
  return exec("git", ["-C", WORKSPACE, "stash", "drop", ref]);
};

const checkout = async (branch) => exec("git", ["-C", WORKSPACE, "checkout", branch]);

const prepareGitWorkspace = async ({ runId, push }) => {
  const initial = await getCurrentBranch();
  if (!initial.ok || !initial.branch) return { ok: false, reason: "git_branch_failed" };

  const dirty = await listDirtyPaths();
  if (!dirty.ok) return { ok: false, reason: dirty.reason };
  if (dirty.paths.length === 0) return { ok: true, initialBranch: initial.branch };

  // Preserve *all* user changes so we can restore the original worktree at the end.
  push(`[${runId}] git: worktree dirty (${dirty.paths.length} paths). stashing to preserve state`);
  const preserve = await stashAll(`self-improve: preserve worktree ${runId}`);
  if (!preserve.ok || !preserve.ref) return { ok: false, reason: "git_stash_preserve_failed" };

  // Create a baseline branch for self-improve so we can commit allowed paths and keep the run isolated.
  const baselineBranch = `codex/selfimprove-baseline-${isoDay().replace(/-/g, "")}-${runId.slice(-6)}`;
  const b = await exec("git", ["-C", WORKSPACE, "checkout", "-b", baselineBranch]);
  if (!b.ok) return { ok: false, reason: "git_checkout_baseline_failed" };
  push(`[${runId}] git: baseline branch=${baselineBranch}`);

  // Re-apply preserved changes onto baseline, then split allowed vs unallowed.
  const applied = await applyStash(preserve.ref);
  if (!applied.ok) return { ok: false, reason: "git_stash_apply_failed" };

  const dirty2 = await listDirtyPaths();
  if (!dirty2.ok) return { ok: false, reason: dirty2.reason };
  const allow = dirty2.paths.filter(isAllowedPath);
  const deny = dirty2.paths.filter((p) => !isAllowedPath(p));

  let denyStashRef = "";
  if (deny.length) {
    push(`[${runId}] git: stashing unallowed paths (${deny.length})`);
    const stashed = await stashPaths({
      message: `self-improve: stash unallowed ${runId}`,
      paths: deny
    });
    if (!stashed.ok) return { ok: false, reason: "git_stash_unallowed_failed" };
    denyStashRef = stashed.ref;
  }

  if (allow.length) {
    push(`[${runId}] git: committing allowed paths (${allow.length})`);
    const add = await exec("git", ["-C", WORKSPACE, "add", "-A", "--", ...allow]);
    if (!add.ok) return { ok: false, reason: "git_add_allowed_failed" };
    const c = await exec("git", ["-C", WORKSPACE, "commit", "-m", `chore(self-improve): baseline ${isoDay()}`]);
    if (!c.ok) {
      // If nothing to commit, keep going; otherwise fail.
      if (!/nothing to commit/i.test(`${c.stdout}\n${c.stderr}`)) {
        return { ok: false, reason: "git_commit_baseline_failed" };
      }
    }
  } else {
    push(`[${runId}] git: no allowed changes to commit`);
  }

  return {
    ok: true,
    initialBranch: initial.branch,
    preserveStashRef: preserve.ref,
    denyStashRef,
    baselineBranch
  };
};

const restoreGitWorkspace = async ({ runId, push, initialBranch, preserveStashRef, denyStashRef }) => {
  if (!initialBranch || !preserveStashRef) return;
  push(`[${runId}] git: restoring original worktree`);
  await checkout(initialBranch);
  const applied = await applyStash(preserveStashRef);
  if (applied.ok) {
    await dropStash(preserveStashRef);
  } else {
    push(`[${runId}] git: preserve stash apply failed; left stash as-is`);
  }
  // Best-effort: drop the unallowed stash created on baseline, if any.
  if (denyStashRef) await dropStash(denyStashRef);
};

const createBranch = async (name) => {
  const r = await exec("git", ["-C", WORKSPACE, "checkout", "-b", name]);
  return r.ok;
};

const commitAll = async (message) => {
  const add = await exec("git", ["-C", WORKSPACE, "add", "-A"]);
  if (!add.ok) return { ok: false, step: "add", ...add };
  const commit = await exec("git", ["-C", WORKSPACE, "commit", "-m", message]);
  return { ok: commit.ok, step: "commit", ...commit };
};

const createDraftPr = async () => {
  // scripts/create_draft_pr.py는 OPENCLAW_WORKSPACE를 요구한다.
  const r = await exec("python3", ["scripts/create_draft_pr.py"], {
    cwd: WORKSPACE,
    env: { ...process.env, OPENCLAW_WORKSPACE: WORKSPACE, OPENCLAW_REPO_PATH: WORKSPACE }
  });
  return r;
};

const waitServerIdle = async () => {
  for (let i = 0; i < 600; i++) {
    const h = await fetchJson(`${BASE_URL}/api/health`).catch(() => null);
    if (h && h.ok && h.data?.running === false) return true;
    await sleep(1000);
  }
  return false;
};

const loadJsonIfExists = async (p) => {
  try {
    return JSON.parse(await fsp.readFile(p, "utf-8"));
  } catch {
    return null;
  }
};

const classifyFailures = (evalResults) => {
  const out = [];
  for (const row of evalResults) {
    if (row.ok) continue;
    const checks = Array.isArray(row.checks) ? row.checks : [];
    const tool = checks.find((c) => c.name === "toolEvents" && c.ok === false);
    const evidence = checks.find((c) => c.name === "evidenceMin" && c.ok === false);
    if (tool) out.push({ type: "tool_visibility", scenarioId: row.id, detail: tool.detail });
    else if (evidence) out.push({ type: "evidence_gate", scenarioId: row.id, detail: evidence.detail });
    else out.push({ type: "unknown", scenarioId: row.id, detail: row.error || "unknown" });
  }
  return out;
};

const fixTaskPrompt = (issue) => {
  if (issue.type === "tool_visibility") {
    return `목표: Tools 탭에 tool start/end 타임라인이 반드시 보이게 해.\n근거: 현재 eval(${issue.scenarioId})에서 tool 이벤트가 없다고 판정됨.\n\n제약:\n- 수정 범위는 /Users/a309/Documents/Agent309/wOpenclaw/apps/ui/server/index.mjs (tools 매핑) 위주\n- 결과는 반드시 TOOL 이벤트 근거로 VERIFY에 stdout/stderr 원문 포함\n- PR/merge/push는 하지 말 것\n`;
  }
  if (issue.type === "evidence_gate") {
    return `목표: code 모드에서 '증거 0인데 성공'이 나오지 않게 해.\n근거: eval(${issue.scenarioId}) evidence gate 실패.\n\n제약:\n- Evaluate/Done 전이를 증거 기반으로 정정\n- VERIFY에 근거(stdout/stderr, 변경 파일)를 포함\n`;
  }
  return `목표: eval(${issue.scenarioId}) 실패를 고쳐.\n세부: ${issue.detail}\n`;
};

const runAgentFix = async (prompt) => {
  // 새 세션 생성 후 code 모드로 실행
  const created = await fetchJson(`${BASE_URL}/api/chat/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentMode: "code",
      permission: PERMISSION,
      modelId: "",
      approvals: { mail: false, deploy: false, merge: false, gitPush: false, prCreate: false }
    })
  });
  if (!created.ok) return { ok: false, error: `create_session_${created.status}` };
  const sessionId = created.data?.session?.id;

  const sent = await fetchJson(`${BASE_URL}/api/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      message: prompt,
      agentMode: "code",
      permission: PERMISSION,
      modelId: "",
      approvals: { mail: false, deploy: false, merge: false, gitPush: false, prCreate: false }
    })
  });
  if (!sent.ok) return { ok: false, error: `send_${sent.status}` };

  // settle
  for (let i = 0; i < 900; i++) {
    const s = await fetchJson(`${BASE_URL}/api/sessions/${sessionId}`);
    if (!s.ok) return { ok: false, error: `load_session_${s.status}` };
    const phase = s.data?.pipeline?.phase ?? "idle";
    const nextType = s.data?.pipeline?.nextAction?.type ?? "auto";
    const status = s.data?.status ?? "idle";
    const stopped = phase === "done" || status === "failed" || status === "cancelled" || (nextType && nextType !== "auto");
    if (stopped) return { ok: true, session: s.data };
    await sleep(2000);
  }
  return { ok: false, error: "timeout" };
};

const main = async () => {
  await fsp.mkdir(OUT_DIR, { recursive: true });
  const runId = `self-improve-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`;
  const log = [];
  const push = (line) => {
    log.push(line);
    process.stdout.write(line + "\n");
  };

  push(`[${runId}] baseUrl=${BASE_URL} permission=${PERMISSION} createPR=${CREATE_PR}`);

  const idle = await waitServerIdle();
  if (!idle) throw new Error("server_not_idle");

  const prep = await prepareGitWorkspace({ runId, push });
  if (!prep.ok) {
    push(`[${runId}] abort: ${prep.reason}`);
    const outPath = path.join(OUT_DIR, `${isoDay()}-${runId}.json`);
    await fsp.writeFile(outPath, JSON.stringify({ runId, ok: false, reason: prep.reason, log }, null, 2), "utf-8");
    process.exit(2);
  }

  let report = { runId, ok: false, reason: "unknown", log };
  const outPath = path.join(OUT_DIR, `${isoDay()}-${runId}.json`);
  try {
    push(`[${runId}] step: run_evals`);
    const evalRun = await runNode(path.join(WORKSPACE, "scripts/evals/run_evals.mjs"));
    if (!evalRun.ok) {
      push(`[${runId}] evals failed code=${evalRun.code}`);
      push(evalRun.stderr.trim());
      report = {
        runId,
        ok: false,
        reason: "eval_failed",
        eval: { code: evalRun.code, stdout: evalRun.stdout, stderr: evalRun.stderr },
        log
      };
      return;
    }

    push(`[${runId}] step: collect_metrics`);
    const metricsRun = await runNode(path.join(WORKSPACE, "scripts/perf/collect_metrics.mjs"));
    if (!metricsRun.ok) {
      push(`[${runId}] metrics failed code=${metricsRun.code}`);
      push(metricsRun.stderr.trim());
      report = {
        runId,
        ok: false,
        reason: "metrics_failed",
        metrics: { code: metricsRun.code, stdout: metricsRun.stdout, stderr: metricsRun.stderr },
        log
      };
      return;
    }

    const evalPath = path.join(EVAL_OUT, `${isoDay()}.json`);
    const evalJson = await loadJsonIfExists(evalPath);
    const evalResults = Array.isArray(evalJson?.results) ? evalJson.results : [];
    const failures = evalResults.filter((r) => r.ok === false);
    push(`[${runId}] eval total=${evalResults.length} failures=${failures.length}`);

    if (!evalResults.length) {
      report = { runId, ok: false, reason: "eval_empty", log };
      push(`[${runId}] abort: eval produced no results`);
      return;
    }

    if (!failures.length) {
      report = { runId, ok: true, fixed: 0, log };
      push(`[${runId}] done: no failures`);
      return;
    }

    const issues = classifyFailures(evalResults).slice(0, TOP_N);
    push(`[${runId}] issues=${issues.length} (top ${TOP_N})`);

    const branch = `codex/autofix-${isoDay().replace(/-/g, "")}-${runId.slice(-6)}`;
    if (!(await createBranch(branch))) throw new Error("failed_to_create_branch");
    push(`[${runId}] branch=${branch}`);

    const fixes = [];
    for (const issue of issues) {
      push(`[${runId}] fix: ${issue.type} scenario=${issue.scenarioId}`);
      const prompt = fixTaskPrompt(issue);
      const fix = await runAgentFix(prompt);
      fixes.push({ issue, fixOk: fix.ok, error: fix.error || null });
      if (!fix.ok) {
        push(`[${runId}] fix failed: ${fix.error}`);
        break;
      }
    }

    // 변경 여부 확인 후 커밋/PR
    const st = await exec("git", ["-C", WORKSPACE, "status", "--porcelain"]);
    const changed = Boolean(st.stdout.trim());
    push(`[${runId}] git changed=${changed}`);

    let prUrl = "";
    if (changed) {
      const c = await commitAll(`autofix: self-improve ${isoDay()}`);
      if (!c.ok) throw new Error(`commit_failed:${c.step}`);
      push(`[${runId}] committed`);
      if (CREATE_PR) {
        const pr = await createDraftPr();
        if (pr.ok) {
          prUrl = pr.stdout.trim();
          push(`[${runId}] draft_pr=${prUrl || "(empty)"}`);
        } else {
          push(`[${runId}] draft_pr_failed`);
          push(pr.stderr.trim());
        }
      }
    }

    report = { runId, ok: true, branch, prUrl, fixes, log };
  } finally {
    await restoreGitWorkspace({
      runId,
      push,
      initialBranch: prep.initialBranch,
      preserveStashRef: prep.preserveStashRef,
      denyStashRef: prep.denyStashRef
    });

    await fsp.writeFile(outPath, JSON.stringify(report, null, 2), "utf-8");
    push(`[${runId}] report=${outPath}`);
  }
};

main().catch((err) => {
  process.stderr.write(String(err?.stack ?? err) + "\n");
  process.exit(1);
});
