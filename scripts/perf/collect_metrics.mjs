import fsp from "fs/promises";
import path from "path";

const WORKSPACE = process.env.WORKSPACE ?? "/Users/a309/Documents/Agent309/wOpenclaw";
const DATA_DIR = path.join(WORKSPACE, "apps/ui/.data");
const SESSIONS_DIR = path.join(DATA_DIR, "sessions");
const RUNS_DIR = path.join(DATA_DIR, "runs");
const OUT_DIR = path.join(DATA_DIR, "metrics");
const DOCS_DIR = path.join(WORKSPACE, "docs/performance");

const DAYS = Number(process.env.METRICS_DAYS ?? 7) || 7;

const now = () => new Date();
const isoDay = (d) => d.toISOString().slice(0, 10);

const readJson = async (p) => JSON.parse(await fsp.readFile(p, "utf-8"));

const listJsonFiles = async (dir) => {
  const names = await fsp.readdir(dir).catch(() => []);
  return names.filter((n) => n.endsWith(".json")).map((n) => path.join(dir, n));
};

const withinDays = (iso, days) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
};

const percentile = (values, p) => {
  const arr = (Array.isArray(values) ? values : []).filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!arr.length) return null;
  const idx = Math.min(arr.length - 1, Math.max(0, Math.floor((p / 100) * (arr.length - 1))));
  return arr[idx];
};

const sumWorld = (world) => {
  const wc = world || {};
  const filesCreated = Array.isArray(wc.filesCreated) ? wc.filesCreated.length : 0;
  const filesModified = Array.isArray(wc.filesModified) ? wc.filesModified.length : 0;
  const filesDeleted = Array.isArray(wc.filesDeleted) ? wc.filesDeleted.length : 0;
  const commands = Array.isArray(wc.commandsExecuted) ? wc.commandsExecuted.length : 0;
  const tests = Array.isArray(wc.testsExecuted) ? wc.testsExecuted.length : 0;
  return { filesCreated, filesModified, filesDeleted, commands, tests };
};

const evidenceGatePass = (world) => {
  const s = sumWorld(world);
  return s.filesCreated + s.filesModified + s.filesDeleted + s.commands + s.tests > 0;
};

const groundedScore = (world) => {
  const s = sumWorld(world);
  let score = 0;
  if (s.filesCreated + s.filesModified + s.filesDeleted > 0) score += 1;
  if (s.commands > 0) score += 1;
  if (s.tests > 0) score += 1;
  return score;
};

const main = async () => {
  await fsp.mkdir(OUT_DIR, { recursive: true });
  await fsp.mkdir(DOCS_DIR, { recursive: true });

  const sessionFiles = await listJsonFiles(SESSIONS_DIR);
  const sessions = [];
  for (const file of sessionFiles) {
    const s = await readJson(file).catch(() => null);
    if (!s) continue;
    if (!withinDays(s.createdAt, DAYS)) continue;
    sessions.push(s);
  }

  const runFiles = await listJsonFiles(RUNS_DIR);
  const runs = [];
  for (const file of runFiles) {
    const r = await readJson(file).catch(() => null);
    if (!r) continue;
    if (!withinDays(r.createdAt, DAYS)) continue;
    runs.push(r);
  }

  // KPI 1: Task Success Rate (code 모드, achieved=yes, evidence gate pass)
  const codeSessions = sessions.filter((s) => (s.agentMode ?? s.mode) === "code");
  const doneEntries = codeSessions
    .map((s) => {
      const history = Array.isArray(s.history) ? s.history : [];
      const done = [...history].reverse().find((h) => h.type === "done") ?? null;
      return { sessionId: s.id, done, session: s };
    })
    .filter((x) => x.done);

  const successEvidence = doneEntries.filter((x) => {
    const achieved = x.done?.evaluation?.achieved === "yes";
    const world = x.done?.execution_summary?.worldChange ?? null;
    return achieved && evidenceGatePass(world);
  });

  const successTextOnly = doneEntries.filter((x) => {
    const achieved = x.done?.evaluation?.achieved === "yes";
    const world = x.done?.execution_summary?.worldChange ?? null;
    return achieved && !evidenceGatePass(world);
  });

  // KPI 2: Tool Utilization (act/verify run meta toolEventSummary 기반)
  const actRuns = runs.filter((r) => r.kind === "act");
  const verifyRuns = runs.filter((r) => r.kind === "verify");
  const toolUtil = (list) => {
    const total = list.length;
    const withTools = list.filter((r) => Number(r.toolEventSummary?.total ?? 0) > 0).length;
    const withMapping = list.filter((r) => Boolean(r.openclawRunId)).length;
    return {
      total,
      withMapping,
      withTools,
      mappingRate: total ? withMapping / total : null,
      toolRate: total ? withTools / total : null
    };
  };

  // KPI 3: Groundedness
  const grounded = doneEntries.map((x) => groundedScore(x.done?.execution_summary?.worldChange ?? null));
  const groundedAvg = grounded.length ? grounded.reduce((a, b) => a + b, 0) / grounded.length : null;

  // KPI 4: Recovery
  const attempts = codeSessions.map((s) => Number(s.pipeline?.loop?.attempt ?? 0) || 0);
  const attemptP50 = percentile(attempts, 50);
  const attemptP90 = percentile(attempts, 90);
  const replanCount = codeSessions.reduce((acc, s) => {
    const h = Array.isArray(s.history) ? s.history : [];
    return acc + (h.some((e) => e.type === "replan") ? 1 : 0);
  }, 0);

  // KPI 5: Latency & Loop Efficiency
  const durations = runs.map((r) => Number(r.durationMs ?? 0)).filter((v) => v > 0);
  const latency = {
    p50: percentile(durations, 50),
    p90: percentile(durations, 90),
    byKind: {}
  };
  for (const kind of ["plan", "act", "verify", "evaluate", "replan"]) {
    const ds = runs.filter((r) => r.kind === kind).map((r) => Number(r.durationMs ?? 0)).filter((v) => v > 0);
    latency.byKind[kind] = { p50: percentile(ds, 50), p90: percentile(ds, 90), n: ds.length };
  }

  const promptChars = runs.map((r) => String(r.prompt ?? "").length);
  const promptStats = { avg: promptChars.length ? Math.round(promptChars.reduce((a, b) => a + b, 0) / promptChars.length) : null,
    p90: percentile(promptChars, 90),
    max: promptChars.length ? Math.max(...promptChars) : null
  };

  // KPI 6: Safety Gate Quality
  const approvalStops = codeSessions.filter((s) => s.pipeline?.phase === "needs_approval").length;
  const fullBypass = codeSessions.filter((s) => s.permission === "full").length;

  const metrics = {
    generatedAt: new Date().toISOString(),
    windowDays: DAYS,
    counts: {
      sessions: sessions.length,
      codeSessions: codeSessions.length,
      runs: runs.length
    },
    kpi: {
      taskSuccessRate: {
        denom: doneEntries.length,
        successEvidence: successEvidence.length,
        successTextOnly: successTextOnly.length,
        rateEvidence: doneEntries.length ? successEvidence.length / doneEntries.length : null
      },
      toolUtilization: {
        act: toolUtil(actRuns),
        verify: toolUtil(verifyRuns)
      },
      groundedness: {
        avgScore0to3: groundedAvg,
        zeroScoreCount: grounded.filter((x) => x === 0).length
      },
      recovery: {
        attemptP50,
        attemptP90,
        replanSessions: replanCount
      },
      latency: {
        ...latency,
        promptChars: promptStats
      },
      safetyGate: {
        approvalStops,
        fullBypass
      }
    },
    samples: {
      successEvidenceSessionIds: successEvidence.slice(0, 10).map((x) => x.sessionId),
      textOnlySessionIds: successTextOnly.slice(0, 10).map((x) => x.sessionId)
    }
  };

  const day = isoDay(now());
  const jsonPath = path.join(OUT_DIR, `${day}.json`);
  await fsp.writeFile(jsonPath, JSON.stringify(metrics, null, 2), "utf-8");

  const md = [];
  md.push(`# 309Agent 성능 보고서 (${day})`);
  md.push(`- 기간: 최근 ${DAYS}일`);
  md.push(`- sessions: ${metrics.counts.sessions}, code sessions: ${metrics.counts.codeSessions}, runs: ${metrics.counts.runs}`);
  md.push("");
  md.push("## KPI");
  md.push(`- 완료율(증거 기반): ${(metrics.kpi.taskSuccessRate.rateEvidence ?? 0).toFixed(3)} (${metrics.kpi.taskSuccessRate.successEvidence}/${metrics.kpi.taskSuccessRate.denom})`);
  md.push(`- 텍스트 성공(증거 0): ${metrics.kpi.taskSuccessRate.successTextOnly}`);
  md.push(`- Tool utilization(act): ${((metrics.kpi.toolUtilization.act.toolRate ?? 0) * 100).toFixed(1)}% (mapping ${(metrics.kpi.toolUtilization.act.mappingRate ?? 0 * 100).toFixed?.(1) ?? metrics.kpi.toolUtilization.act.mappingRate})`);
  md.push(`- Tool utilization(verify): ${((metrics.kpi.toolUtilization.verify.toolRate ?? 0) * 100).toFixed(1)}%`);
  md.push(`- Groundedness(avg 0..3): ${(metrics.kpi.groundedness.avgScore0to3 ?? 0).toFixed(2)} (0점 ${metrics.kpi.groundedness.zeroScoreCount})`);
  md.push(`- Recovery(attempt p50/p90): ${metrics.kpi.recovery.attemptP50 ?? "-"} / ${metrics.kpi.recovery.attemptP90 ?? "-"}`);
  md.push(`- Latency(ms p50/p90): ${metrics.kpi.latency.p50 ?? "-"} / ${metrics.kpi.latency.p90 ?? "-"}`);
  md.push(`- Prompt chars(avg/p90/max): ${metrics.kpi.latency.promptChars.avg ?? "-"} / ${metrics.kpi.latency.promptChars.p90 ?? "-"} / ${metrics.kpi.latency.promptChars.max ?? "-"}`);
  md.push(`- Safety gate: needs_approval ${metrics.kpi.safetyGate.approvalStops}, full bypass sessions ${metrics.kpi.safetyGate.fullBypass}`);
  md.push("");
  md.push("## 샘플");
  md.push(`- successEvidenceSessionIds: ${metrics.samples.successEvidenceSessionIds.join(", ") || "-"}`);
  md.push(`- textOnlySessionIds: ${metrics.samples.textOnlySessionIds.join(", ") || "-"}`);

  const mdPath = path.join(DOCS_DIR, `agent_performance_report-${day}.md`);
  await fsp.writeFile(mdPath, md.join("\n"), "utf-8");

  process.stdout.write(`metrics json: ${jsonPath}\n`);
  process.stdout.write(`report md: ${mdPath}\n`);
};

main().catch((err) => {
  process.stderr.write(String(err?.stack ?? err) + "\n");
  process.exit(1);
});

