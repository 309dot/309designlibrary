import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { execFile } from "child_process";

const WORKSPACE = process.env.WORKSPACE ?? "/Users/a309/Documents/Agent309/wOpenclaw";
const BASE_URL = process.env.EVAL_BASE_URL ?? "http://localhost:4310";
const SCENARIO_DIR = path.join(WORKSPACE, "scripts/evals/scenarios");
const OUT_DIR = path.join(WORKSPACE, "apps/ui/.data/evals");
const EVAL_SANDBOX = path.join(WORKSPACE, "workspace/__eval__");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const nowStamp = () => new Date().toISOString().slice(0, 10);

const readJson = async (p) => JSON.parse(await fsp.readFile(p, "utf-8"));

const listScenarioFiles = async () => {
  const names = await fsp.readdir(SCENARIO_DIR);
  return names
    .filter((n) => n.endsWith(".json"))
    .map((n) => path.join(SCENARIO_DIR, n))
    .sort();
};

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

const ensureEvalSandboxClean = async () => {
  // eval sandbox는 untracked 파일이 쌓이므로, 러너가 정리한다.
  await fsp.mkdir(EVAL_SANDBOX, { recursive: true });
};

const git = (args) =>
  new Promise((resolve) => {
    execFile("git", ["-C", WORKSPACE, ...args], (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout?.toString() ?? "",
        stderr: stderr?.toString() ?? ""
      });
    });
  });

const cleanEvalSandbox = async () => {
  // workspace/__eval__ 아래 untracked 파일만 삭제한다.
  return git(["clean", "-fd", "--", "workspace/__eval__"]);
};

const parseEvidenceMin = (expr) => {
  const raw = String(expr ?? "none").trim();
  if (raw === "none") return { kind: "none" };
  const m = raw.match(/^(filesCreated|filesModified|filesDeleted|commands)\s*>=\s*(\d+)$/i);
  if (!m) return { kind: "unknown", raw };
  return { kind: m[1], min: Number(m[2]) || 0 };
};

const getWorldChangeFromSession = (session) => {
  const history = Array.isArray(session?.history) ? session.history : [];
  const lastDone = [...history].reverse().find((h) => h.type === "done") ?? null;
  const lastAct = [...history].reverse().find((h) => h.type === "act") ?? null;
  const world =
    lastDone?.execution_summary?.worldChange ??
    lastAct?.execution_summary?.worldChange ??
    null;
  return world || {
    filesCreated: [],
    filesModified: [],
    filesDeleted: [],
    commandsExecuted: [],
    testsExecuted: []
  };
};

const readEvalAchieved = (session) => {
  const achieved = session?.pipeline?.evaluation?.achieved ?? null;
  if (!achieved) return null;
  return String(achieved).toLowerCase().startsWith("y") ? "yes" : "no";
};

const waitUntilSettled = async ({ sessionId, timeoutMs = 12 * 60 * 1000 }) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetchJson(`${BASE_URL}/api/sessions/${sessionId}`);
    if (!r.ok) throw new Error(`failed_to_load_session:${r.status}`);
    const session = r.data;
    const phase = session?.pipeline?.phase ?? "idle";
    const nextType = session?.pipeline?.nextAction?.type ?? "auto";
    const status = session?.status ?? "idle";

    const stopped =
      phase === "done" ||
      status === "failed" ||
      status === "cancelled" ||
      (nextType && nextType !== "auto");
    if (stopped) return session;
    await sleep(1500);
  }
  throw new Error("timeout_waiting_for_settle");
};

const checkToolEvents = async (session) => {
  const runs = Array.isArray(session?.runs) ? session.runs : [];
  const act = [...runs].reverse().find((r) => r.kind === "act") ?? null;
  const verify = [...runs].reverse().find((r) => r.kind === "verify") ?? null;
  const targets = [act, verify].filter(Boolean);
  if (!targets.length) return { ok: false, reason: "no_act_or_verify_run" };

  for (const run of targets) {
    const t = await fetchJson(`${BASE_URL}/api/runs/${run.id}/tools`);
    if (!t.ok) return { ok: false, reason: `tools_api_${t.status}` };
    const total = Number(t.data?.mapping?.toolEventSummary?.total ?? 0) || 0;
    if (total > 0) return { ok: true, reason: "tool_events_present" };
  }
  return { ok: false, reason: "tool_events_missing" };
};

const meetsEvidenceMin = ({ world, expectedExpr }) => {
  const spec = parseEvidenceMin(expectedExpr);
  if (spec.kind === "none") return { ok: true, detail: "none" };
  if (spec.kind === "unknown") return { ok: false, detail: `unknown_expr:${spec.raw}` };

  const created = Array.isArray(world.filesCreated) ? world.filesCreated.length : 0;
  const modified = Array.isArray(world.filesModified) ? world.filesModified.length : 0;
  const deleted = Array.isArray(world.filesDeleted) ? world.filesDeleted.length : 0;
  const commands = Array.isArray(world.commandsExecuted) ? world.commandsExecuted.length : 0;

  const value =
    spec.kind.toLowerCase() === "filescreated"
      ? created
      : spec.kind.toLowerCase() === "filesmodified"
        ? modified
        : spec.kind.toLowerCase() === "filesdeleted"
          ? deleted
          : spec.kind.toLowerCase() === "commands"
            ? commands
            : 0;

  return { ok: value >= spec.min, detail: `${spec.kind}=${value} need>=${spec.min}` };
};

const main = async () => {
  await ensureEvalSandboxClean();
  await fsp.mkdir(OUT_DIR, { recursive: true });

  const scenarioFiles = await listScenarioFiles();
  const results = [];

  for (const file of scenarioFiles) {
    const scenario = await readJson(file);
    const startedAt = new Date().toISOString();

    // 단일 실행 보장: 서버가 실행 중이면 대기
    for (;;) {
      const health = await fetchJson(`${BASE_URL}/api/health`);
      if (health.ok && health.data?.running === false) break;
      await sleep(1000);
    }

    const created = await fetchJson(`${BASE_URL}/api/chat/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentMode: scenario.agentMode,
        permission: scenario.permission,
        modelId: scenario.modelId ?? "",
        approvals: { mail: false, deploy: false, merge: false, gitPush: false, prCreate: false }
      })
    });

    if (!created.ok) {
      results.push({
        id: scenario.id,
        title: scenario.title,
        file,
        startedAt,
        ok: false,
        error: `failed_to_create_session:${created.status}`
      });
      await cleanEvalSandbox();
      continue;
    }

    const sessionId = created.data?.session?.id;
    const sent = await fetchJson(`${BASE_URL}/api/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: scenario.message,
        agentMode: scenario.agentMode,
        permission: scenario.permission,
        modelId: scenario.modelId ?? "",
        approvals: { mail: false, deploy: false, merge: false, gitPush: false, prCreate: false }
      })
    });

    if (!sent.ok) {
      results.push({
        id: scenario.id,
        title: scenario.title,
        file,
        startedAt,
        sessionId,
        ok: false,
        error: `failed_to_send:${sent.status}`
      });
      await cleanEvalSandbox();
      continue;
    }

    let finalSession = null;
    let error = null;
    try {
      finalSession = await waitUntilSettled({ sessionId });
    } catch (e) {
      error = String(e?.message ?? e);
    }

    if (!finalSession) {
      results.push({
        id: scenario.id,
        title: scenario.title,
        file,
        startedAt,
        sessionId,
        ok: false,
        error
      });
      await cleanEvalSandbox();
      continue;
    }

    const expectedAchieved = String(scenario.expected?.evaluationAchieved ?? "").trim() || null;
    const actualAchieved = readEvalAchieved(finalSession);
    const world = getWorldChangeFromSession(finalSession);

    const checks = [];
    if (expectedAchieved) {
      checks.push({
        name: "evaluationAchieved",
        ok: expectedAchieved === actualAchieved,
        detail: `expected=${expectedAchieved} actual=${actualAchieved}`
      });
    }

    const evidenceExpr = scenario.expected?.evidenceMin ?? "none";
    checks.push({
      name: "evidenceMin",
      ...meetsEvidenceMin({ world, expectedExpr: evidenceExpr })
    });

    if (scenario.expected?.mustHaveToolEvents) {
      const tool = await checkToolEvents(finalSession);
      checks.push({ name: "toolEvents", ok: tool.ok, detail: tool.reason });
    }

    const ok = checks.every((c) => c.ok);
    results.push({
      id: scenario.id,
      title: scenario.title,
      file,
      startedAt,
      completedAt: new Date().toISOString(),
      sessionId,
      ok,
      checks,
      summary: {
        achieved: actualAchieved,
        phase: finalSession?.pipeline?.phase ?? null,
        nextAction: finalSession?.pipeline?.nextAction ?? null,
        worldChange: world
      }
    });

    await cleanEvalSandbox();
  }

  const outPath = path.join(OUT_DIR, `${nowStamp()}.json`);
  await fsp.writeFile(outPath, JSON.stringify({ baseUrl: BASE_URL, results }, null, 2), "utf-8");
  process.stdout.write(`evals saved: ${outPath}\n`);
};

main().catch((err) => {
  process.stderr.write(String(err?.stack ?? err) + "\n");
  process.exit(1);
});
