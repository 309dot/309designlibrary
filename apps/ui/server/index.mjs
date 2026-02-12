import express from "express";
import cors from "cors";
import { spawn, execFile } from "child_process";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const WORKSPACE =
  process.env.WORKSPACE ?? "/Users/a309/Documents/Agent309/wOpenclaw";
const DATA_DIR = process.env.DATA_DIR ?? path.join(WORKSPACE, "apps/ui/.data");
const RUNS_DIR = path.join(DATA_DIR, "runs");
const SESSIONS_DIR = path.join(DATA_DIR, "sessions");
const MEMORY_DIR = path.join(DATA_DIR, "memory");
const GLOBAL_MEMORY_PATH = path.join(MEMORY_DIR, "global.md");

const OPENCLAW_BIN =
  process.env.OPENCLAW_BIN ?? "/Users/a309/.openclaw/bin/openclaw";
const OPENCLAW_CONFIG =
  process.env.OPENCLAW_CONFIG ??
  "/Users/a309/Documents/Agent309/wOpenclaw/.openclaw-state/openclaw.json";
const OPENCLAW_STATE_DIR =
  process.env.OPENCLAW_STATE_DIR ??
  "/Users/a309/Documents/Agent309/wOpenclaw/.openclaw-state";
const OPENCLAW_LOG_DIR = process.env.OPENCLAW_LOG_DIR ?? "/tmp/openclaw";

const PRESET_MODELS = {
  assistant: "qwen2.5:7b",
  dev: "qwen2.5:14b",
  design: "qwen2.5:32b"
};

const defaultApprovals = {
  mail: false,
  deploy: false,
  merge: false,
  gitPush: false,
  prCreate: false
};

const approvalKeywords = {
  mail: /메일|email|gmail|calendar|캘린더|보내|send/i,
  deploy: /배포|deploy|release|prod|production/i,
  merge: /머지|merge/i,
  gitPush: /git\s*push|push origin/i,
  prCreate: /\bPR\b|pull request|draft pr/i
};

const inferRequiredApprovals = (text) => {
  const required = { ...defaultApprovals };
  const block = String(text ?? "");
  for (const [key, regex] of Object.entries(approvalKeywords)) {
    required[key] = regex.test(block);
  }
  return required;
};

const state = {
  active: null
};

const MAX_LOG_BYTES = 200_000;

const ensureDirs = async () => {
  await fsp.mkdir(RUNS_DIR, { recursive: true });
  await fsp.mkdir(SESSIONS_DIR, { recursive: true });
  await fsp.mkdir(MEMORY_DIR, { recursive: true });
};

const readJson = async (filePath) => {
  const raw = await fsp.readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

const writeJson = async (filePath, data) => {
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2));
};

const readText = async (filePath) => {
  try {
    return await fsp.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
};

const writeText = async (filePath, text) => {
  await fsp.writeFile(filePath, String(text ?? ""), "utf-8");
};

const trimCharsFromEnd = (value, maxChars) => {
  const s = String(value ?? "");
  if (s.length <= maxChars) return s;
  return s.slice(Math.max(0, s.length - maxChars));
};

const toOneLine = (value, maxLen = 180) => {
  const s = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
};

const normalizeSession = (session) => {
  const createdAt = session?.createdAt ?? new Date().toISOString();
  const approvals = {
    mail: false,
    deploy: false,
    merge: false,
    gitPush: false,
    prCreate: false,
    ...(session?.approvals ?? {})
  };
  const pipeline = {
    planOnly: false,
    auto: true,
    phase: "idle", // idle|planning|acting|verifying|done|needs_approval
    pendingContinue: false,
    activeRunId: null,
    ...(session?.pipeline ?? {})
  };
  const memory = {
    sessionSummary: "",
    updatedAt: null,
    ...(session?.memory ?? {})
  };
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  const requiredApprovals = {
    mail: false,
    deploy: false,
    merge: false,
    gitPush: false,
    prCreate: false,
    ...(session?.requiredApprovals ?? {})
  };

  return {
    ...session,
    createdAt,
    approvals,
    pipeline,
    memory,
    messages,
    requiredApprovals,
    lastAnswer: session?.lastAnswer ?? ""
  };
};

const loadConfig = async () => {
  const raw = await fsp.readFile(OPENCLAW_CONFIG, "utf-8");
  return JSON.parse(raw);
};

const listModels = async () => {
  const cfg = await loadConfig();
  const models =
    cfg?.models?.providers?.ollama?.models?.map((model) => ({
      id: model.id,
      name: model.name ?? model.id
    })) ?? [];
  return models;
};

const getPresetMap = async () => {
  const models = await listModels();
  const modelIds = new Set(models.map((model) => model.id));
  const presetMap = { ...PRESET_MODELS };
  for (const [preset, modelId] of Object.entries(presetMap)) {
    if (!modelIds.has(modelId)) {
      presetMap[preset] = models[0]?.id ?? modelId;
    }
  }
  return presetMap;
};

const maskToken = (token) => {
  if (!token) return null;
  if (token.length <= 6) return "••••";
  return `${token.slice(0, 2)}••••${token.slice(-4)}`;
};

const getGatewayLogPath = () => {
  const stamp = new Date().toISOString().slice(0, 10);
  return path.join(OPENCLAW_LOG_DIR, `openclaw-${stamp}.log`);
};

const resolveClientPath = (inputPath) => {
  if (!inputPath) return WORKSPACE;
  let raw = inputPath.trim();
  if (!raw) return WORKSPACE;
  if (raw.startsWith("/workspace")) {
    raw = path.join(WORKSPACE, raw.replace(/^\/workspace\/?/, ""));
  } else if (!path.isAbsolute(raw)) {
    raw = path.join(WORKSPACE, raw);
  }
  const resolved = path.resolve(raw);
  if (!resolved.startsWith(WORKSPACE)) {
    throw new Error("path_outside_workspace");
  }
  return resolved;
};

const toClientPath = (absolutePath) => {
  if (!absolutePath) return "/workspace";
  if (absolutePath.startsWith(WORKSPACE)) {
    const rel = path.relative(WORKSPACE, absolutePath);
    return rel ? `/workspace/${rel}` : "/workspace";
  }
  return absolutePath;
};

const rewriteWorkspacePaths = (text) => {
  if (!text) return { text, rewritten: false };
  let rewritten = false;
  const replaced = text.replace(
    /(^|\s)(\/workspace(?:\/[^\s"'`]+)?)/g,
    (match, lead, token) => {
      rewritten = true;
      const rel = token.replace(/^\/workspace\/?/, "");
      const abs = path.join(WORKSPACE, rel);
      return `${lead}${abs}`;
    }
  );
  return { text: replaced, rewritten };
};

const createId = () => {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const rnd = crypto.randomBytes(2).toString("hex");
  return `${stamp}-${rnd}`;
};

const readLogChunk = async (filePath, offset) => {
  const stat = await fsp.stat(filePath).catch(() => null);
  if (!stat) {
    return { data: "", nextOffset: offset, eof: true };
  }
  const size = stat.size;
  if (offset >= size) {
    return { data: "", nextOffset: size, eof: true };
  }
  const toRead = Math.min(MAX_LOG_BYTES, size - offset);
  const handle = await fsp.open(filePath, "r");
  const buffer = Buffer.alloc(toRead);
  await handle.read(buffer, 0, toRead, offset);
  await handle.close();
  return {
    data: buffer.toString("utf-8"),
    nextOffset: offset + toRead,
    eof: offset + toRead >= size
  };
};

const readTail = async (filePath, maxBytes = 2_000_000) => {
  const stat = await fsp.stat(filePath).catch(() => null);
  if (!stat) return "";
  const size = stat.size;
  const start = Math.max(0, size - maxBytes);
  const handle = await fsp.open(filePath, "r");
  const buffer = Buffer.alloc(size - start);
  await handle.read(buffer, 0, size - start, start);
  await handle.close();
  return buffer.toString("utf-8");
};

const parseToolEvents = (raw, runIdFilter = null) => {
  if (!raw) return [];
  const lines = raw.split("\n").filter(Boolean);
  const events = [];
  for (const line of lines) {
    if (!line.includes("tool start") && !line.includes("tool end")) {
      continue;
    }
    const ts = line.match(/^(\d{4}-\d{2}-\d{2}T[^\s]+)/)?.[1] ?? null;
    const kind = line.includes("tool start") ? "start" : "end";
    const tool = line.match(/tool=([a-zA-Z0-9_-]+)/)?.[1] ?? null;
    const toolCallId = line.match(/toolCallId=([^\s]+)/)?.[1] ?? null;
    const runId = line.match(/runId=([^\s]+)/)?.[1] ?? null;
    if (runIdFilter && runId && runId !== runIdFilter) continue;
    events.push({
      at: ts,
      kind,
      tool,
      toolCallId,
      runId,
      raw: line
    });
  }
  return events;
};

const findRunIdForSession = (raw, sessionId) => {
  if (!raw) return null;
  const lines = raw.split("\n").filter(Boolean);
  for (const line of lines) {
    if (!line.includes("embedded run start")) continue;
    if (!line.includes(`sessionId=${sessionId}`)) continue;
    const runId = line.match(/runId=([^\s]+)/)?.[1] ?? null;
    if (runId) return runId;
  }
  return null;
};

const listRuns = async () => {
  await ensureDirs();
  const entries = await fsp.readdir(RUNS_DIR);
  const metas = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    try {
      const metaPath = path.join(RUNS_DIR, entry);
      const meta = await readJson(metaPath);
      metas.push(meta);
    } catch {
      // ignore invalid files
    }
  }
  metas.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return metas;
};

const listSessions = async () => {
  await ensureDirs();
  const entries = await fsp.readdir(SESSIONS_DIR);
  const sessions = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    try {
      const session = await readJson(path.join(SESSIONS_DIR, entry));
      sessions.push(normalizeSession(session));
    } catch {
      // ignore
    }
  }
  sessions.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return sessions;
};

const loadSession = async (sessionId) => {
  const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
  const raw = await readJson(sessionPath);
  const normalized = normalizeSession(raw);
  if (JSON.stringify(raw) !== JSON.stringify(normalized)) {
    await writeJson(sessionPath, normalized).catch(() => {});
  }
  return normalized;
};

const saveSession = async (session) => {
  const sessionPath = path.join(SESSIONS_DIR, `${session.id}.json`);
  const normalized = normalizeSession(session);
  await writeJson(sessionPath, normalized);
  return normalized;
};

const updateSession = async (sessionId, updater) => {
  const session = await loadSession(sessionId);
  const updated = updater(session);
  await saveSession(updated);
  return updated;
};

const createSession = async ({ title, request, modelPreset, modelId, approvals }) => {
  const id = createId();
  const createdAt = new Date().toISOString();
  const session = {
    id,
    title: title || request?.slice(0, 60) || "New chat",
    createdAt,
    status: request ? "planning" : "idle",
    request: request ?? "",
    plan: "",
    planEdited: false,
    modelPreset,
    modelId,
    approvals: {
      mail: false,
      deploy: false,
      merge: false,
      gitPush: false,
      prCreate: false,
      ...approvals
    },
    requiredApprovals: { ...defaultApprovals },
    messages: request
      ? [
          {
            id: createId(),
            role: "user",
            kind: "user",
            text: request,
            at: new Date().toISOString()
          }
        ]
      : [],
    memory: {
      sessionSummary: "",
      updatedAt: null
    },
    pipeline: {
      planOnly: false,
      auto: true,
      phase: request ? "planning" : "idle",
      pendingContinue: false,
      activeRunId: null
    },
    lastAnswer: "",
    runs: []
  };
  await saveSession(session);
  return session;
};

const extractPayloadText = (raw) => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const parsed = JSON.parse(trimmed);
    const payloads = parsed?.result?.payloads ?? parsed?.payloads ?? [];
    const texts = payloads
      .map((item) => item?.text ?? item?.content?.text)
      .filter(Boolean);
    if (texts.length) return texts.join("\n\n");
  } catch {
    // fallback to line-by-line
  }
  const lines = trimmed.split("\n");
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      const payloads = parsed?.result?.payloads ?? parsed?.payloads ?? [];
      const texts = payloads
        .map((item) => item?.text ?? item?.content?.text)
        .filter(Boolean);
      if (texts.length) return texts.join("\n\n");
    } catch {
      // ignore
    }
  }
  return trimmed;
};

const extractHumanAnswer = (raw) => {
  let text = extractPayloadText(raw);
  if (!text) return "";
  text = String(text)
    .replace(/<tool_call[^>]*>[\s\S]*?<\/tool_call>/g, "")
    .replace(/<tool_call[^>]*>/g, "")
    .replace(/<\/tool_call>/g, "")
    .replace(/^\s*[_-]{1,}\s*$/gm, "")
    .trim();

  const upper = text.toUpperCase();
  const idx = upper.indexOf("RESULT:");
  if (idx >= 0) {
    const rest = text.slice(idx + "RESULT:".length);
    const endCandidates = ["NEXT:", "RISKS:", "NEEDS_APPROVAL:", "PLAN:", "ACTIONS:", "VERIFY:"];
    let end = rest.length;
    for (const marker of endCandidates) {
      const mi = rest.toUpperCase().indexOf(marker);
      if (mi >= 0) end = Math.min(end, mi);
    }
    const picked = rest.slice(0, end).trim();
    if (picked) return picked;
  }
  return text.trim();
};

const summarizeSystemPrompt = (report) => {
  if (!report) return null;
  const systemPrompt = report.systemPrompt ?? {};
  const injected = (report.injectedWorkspaceFiles ?? []).map((file) => ({
    name: file.name,
    path: file.path,
    chars: file.injectedChars ?? file.rawChars ?? 0
  }));
  return {
    chars: systemPrompt.chars ?? null,
    projectContextChars: systemPrompt.projectContextChars ?? null,
    nonProjectContextChars: systemPrompt.nonProjectContextChars ?? null,
    injectedFiles: injected
  };
};

const extractRunSummary = (raw) => {
  const summary = {
    usage: null,
    systemPrompt: null
  };

  const applyParsed = (parsed) => {
    const meta = parsed?.result?.meta ?? parsed?.meta ?? null;
    const usage = meta?.agentMeta?.usage ?? parsed?.agentMeta?.usage ?? null;
    if (usage) summary.usage = usage;
    const report = meta?.systemPromptReport ?? parsed?.systemPromptReport ?? null;
    if (report) summary.systemPrompt = summarizeSystemPrompt(report);
  };

  const trimmed = raw.trim();
  if (!trimmed) return summary;
  try {
    const parsed = JSON.parse(trimmed);
    applyParsed(parsed);
    return summary;
  } catch {
    // ignore
  }

  const lines = trimmed.split("\n");
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      applyParsed(parsed);
    } catch {
      // ignore
    }
  }
  return summary;
};

const buildPlanPrompt = ({ request, contextPrefix }) => {
  return `${contextPrefix || ""}너는 로컬 OpenClaw 에이전트다. 도구를 사용하지 말고 "계획"만 작성한다.\n\n출력 형식:\nPLAN:\n- (단계)\nRISKS:\n- (리스크)\nNEEDS_APPROVAL: mail|calendar|deploy|merge|git push|PR (해당되는 것만)\n\n요청:\n${request}`;
};

const formatApprovals = (approvals) => {
  const approved = Object.entries(approvals || {})
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(", ");
  return approved || "없음";
};

const appendMessage = async (sessionId, message) => {
  return updateSession(sessionId, (session) => {
    const normalized = normalizeSession(session);
    const messages = [...(normalized.messages || [])];
    messages.push({
      id: createId(),
      at: new Date().toISOString(),
      kind: message?.kind ?? message?.role ?? "system",
      role: message?.role ?? "system",
      text: String(message?.text ?? ""),
      runId: message?.runId ?? null
    });
    return { ...normalized, messages };
  });
};

const getRecentMessagesForContext = (messages, limit = 6) => {
  const recent = [...(messages || [])].slice(-limit);
  const lines = [];
  for (const m of recent) {
    const role = m.role === "assistant" ? "ASSISTANT" : m.role === "user" ? "USER" : "SYSTEM";
    const text = String(m.text ?? "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    lines.push(`${role}: ${text.slice(0, 400)}`);
  }
  return lines.join("\n");
};

const loadGlobalMemory = async () => {
  await ensureDirs();
  return trimCharsFromEnd(await readText(GLOBAL_MEMORY_PATH), 1500).trim();
};

const updateGlobalMemory = async (entry) => {
  await ensureDirs();
  const prev = await readText(GLOBAL_MEMORY_PATH);
  const next = `${prev}${prev.trim() ? "\n" : ""}${entry}`.trim();
  await writeText(GLOBAL_MEMORY_PATH, trimCharsFromEnd(next, 1500));
};

const updateSessionMemory = async (sessionId, entry) => {
  return updateSession(sessionId, (session) => {
    const normalized = normalizeSession(session);
    const prev = String(normalized.memory?.sessionSummary ?? "").trim();
    const next = `${prev}${prev ? "\n" : ""}${entry}`.trim();
    return {
      ...normalized,
      memory: {
        sessionSummary: trimCharsFromEnd(next, 1500),
        updatedAt: new Date().toISOString()
      }
    };
  });
};

const buildContextPrefix = async (session) => {
  const globalMemory = await loadGlobalMemory();
  const sessionMemory = String(session?.memory?.sessionSummary ?? "").trim();
  const recent = getRecentMessagesForContext(session?.messages ?? [], 6);

  const blocks = [];
  if (globalMemory) blocks.push(`GLOBAL_MEMORY:\n${globalMemory}`);
  if (sessionMemory) blocks.push(`SESSION_MEMORY:\n${sessionMemory}`);
  if (recent) blocks.push(`RECENT_MESSAGES:\n${recent}`);
  return blocks.length ? `${blocks.join("\n\n")}\n\n---\n\n` : "";
};

const parseNeedsApproval = (planText) => {
  const required = { ...defaultApprovals };
  const block = String(planText ?? "");
  const upper = block.toUpperCase();
  const idx = upper.indexOf("NEEDS_APPROVAL");
  if (idx < 0) return required;
  const tail = block.slice(idx, idx + 800).toLowerCase();
  if (/(mail|email|gmail|calendar|캘린더|메일)/.test(tail)) required.mail = true;
  if (/(deploy|배포|release|prod|production)/.test(tail)) required.deploy = true;
  if (/(merge|머지)/.test(tail)) required.merge = true;
  if (/(git\s*push|push\s+origin|push)/.test(tail)) required.gitPush = true;
  if (/(pr\b|pull request|draft)/.test(tail)) required.prCreate = true;
  return required;
};

const approvalsSatisfied = (required, approvals) => {
  const req = required || defaultApprovals;
  const app = approvals || defaultApprovals;
  return Object.entries(req).every(([key, needed]) => !needed || Boolean(app[key]));
};

const buildActPrompt = ({ request, plan, approvals, contextPrefix }) => {
  const approvalText = formatApprovals(approvals);
  return `${contextPrefix || ""}너는 로컬 OpenClaw 에이전트이며 실제로 실행한다.\n\n규칙:\n- 파일/디렉터리 확인, git, 테스트, 쉘 실행은 반드시 tool을 사용한다.\n- tool 없이 실행했다고 말하지 말 것.\n- 승인되지 않은 위험 작업(메일/캘린더 발송, 배포, 머지, git push/PR)은 절대 실행하지 말고 승인을 요청한다.\n- 출력 형식: PLAN -> ACTIONS(tool 호출 포함) -> VERIFY(stdout/stderr 원문) -> RESULT(변경 파일/테스트) -> NEXT\n\n승인됨: ${approvalText}\n\n요청:\n${request}\n\n계획:\n${plan || "(계획 없음)"}`;
};

const runCommand = (cmd, args, cwd) =>
  new Promise((resolve) => {
    execFile(cmd, args, { cwd }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout?.toString() ?? "",
        stderr: stderr?.toString() ?? ""
      });
    });
  });

const getRepoRoot = async () => {
  const result = await runCommand("git", ["-C", WORKSPACE, "rev-parse", "--show-toplevel"]);
  if (!result.ok) return null;
  return result.stdout.trim() || null;
};

const getGitStatusSnapshot = async () => {
  const repoRoot = await getRepoRoot();
  if (!repoRoot) return null;
  const status = await runCommand("git", ["-C", repoRoot, "status", "--porcelain"]);
  if (!status.ok) return null;
  return status.stdout;
};

const loadVerifyCommand = async () => {
  const filePath = path.join(WORKSPACE, "PROJECT_TESTS.json");
  try {
    const raw = await fsp.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    const cmd = String(data?.default ?? "").trim();
    return cmd || "";
  } catch {
    return "";
  }
};

const buildVerifyPrompt = ({ request, plan, verifyCmd, contextPrefix }) => {
  return `${contextPrefix || ""}너는 로컬 OpenClaw 에이전트이며 "검증(Verify)" 단계만 수행한다.\n\n목표:\n- 아래 테스트 명령을 tool(exec)로 실행한다.\n- stdout/stderr 원문을 포함해 결과를 요약한다.\n\n규칙:\n- 테스트는 반드시 tool(exec)로 실행한다.\n- 출력 형식: ACTIONS(tool 호출 포함) -> VERIFY(stdout/stderr 원문) -> RESULT(테스트 통과/실패) -> NEXT\n\n테스트 명령:\n${verifyCmd}\n\n요청(참고):\n${request}\n\n계획(참고):\n${plan || "(계획 없음)"}`;
};

const getDiffArtifacts = async () => {
  const repoRoot = await getRepoRoot();
  if (!repoRoot) {
    return { files: [], diff: "" };
  }
  const status = await runCommand("git", ["-C", repoRoot, "status", "--porcelain"]);
  const files = status.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.slice(3));
  const diff = await runCommand("git", ["-C", repoRoot, "diff"]);
  const cached = await runCommand("git", ["-C", repoRoot, "diff", "--cached"]);
  const mergedDiff = [diff.stdout, cached.stdout].filter(Boolean).join("\n");
  return { files, diff: mergedDiff };
};

const startRun = async ({ prompt, modelId, kind, sessionId }) => {
  await ensureDirs();
  await fsp.access(OPENCLAW_BIN);
  await fsp.access(OPENCLAW_CONFIG);

  const gitStatusBefore = sessionId && kind === "act" ? await getGitStatusSnapshot() : null;

  const id = createId();
  const createdAt = new Date().toISOString();
  const logPath = path.join(RUNS_DIR, `${id}.log`);
  const gatewayLogPath = getGatewayLogPath();
  const metaPath = path.join(RUNS_DIR, `${id}.json`);

  const cfg = await loadConfig();
  const tempConfigPath = await (async () => {
    if (!modelId) return null;
    if (!cfg?.agents?.defaults) return null;
    cfg.agents.defaults.model = cfg.agents.defaults.model ?? {};
    cfg.agents.defaults.model.primary = `ollama/${modelId}`;
    const tempPath = path.join(RUNS_DIR, `${id}.config.json`);
    await fsp.writeFile(tempPath, JSON.stringify(cfg, null, 2));
    return tempPath;
  })();

  const meta = {
    id,
    sessionId,
    kind,
    prompt,
    createdAt,
    status: "running",
    logPath,
    gatewayLogPath,
    configPath: OPENCLAW_CONFIG,
    modelId: modelId ?? null,
    stateDir: OPENCLAW_STATE_DIR,
    exitCode: null,
    completedAt: null,
    durationMs: null
  };

  await writeJson(metaPath, meta);

  if (sessionId) {
    await updateSession(sessionId, (session) => ({
      ...session,
      status: kind === "plan" ? "planning" : "running",
      pipeline: {
        ...(session.pipeline ?? {}),
        phase: kind === "plan" ? "planning" : kind === "verify" ? "verifying" : "acting",
        pendingContinue: false,
        activeRunId: id,
        gitStatusBeforeAct: gitStatusBefore ?? (session.pipeline?.gitStatusBeforeAct ?? null)
      },
      runs: [...(session.runs || []), meta]
    }));
  }

  const env = {
    ...process.env,
    OPENCLAW_STATE_DIR,
    OPENCLAW_CONFIG_PATH: tempConfigPath ?? OPENCLAW_CONFIG
  };

  if (cfg?.gateway?.auth?.token) {
    env.OPENCLAW_GATEWAY_TOKEN = cfg.gateway.auth.token;
  }
  if (cfg?.gateway?.remote?.url) {
    env.OPENCLAW_GATEWAY_URL = cfg.gateway.remote.url;
  }

  const agentOut = fs.createWriteStream(logPath, { flags: "a" });
  state.active = { id, agent: null, metaPath };

  const startAt = Date.now();

  const openclawSessionId = sessionId ? `ui-thread-${sessionId}` : `ui-${id}`;
  const agent = spawn(
    OPENCLAW_BIN,
    ["agent", "--session-id", openclawSessionId, "--message", prompt, "--json"],
    { env }
  );

  state.active.agent = agent;

  agent.stdout.pipe(agentOut);
  agent.stderr.pipe(agentOut);

  const finish = async (status, code) => {
    const updated = {
      ...meta,
      status,
      exitCode: code ?? null,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startAt
    };
    await writeJson(metaPath, updated);
    if (tempConfigPath) {
      await fsp.unlink(tempConfigPath).catch(() => {});
    }
    state.active = null;
    agentOut.end();

    if (sessionId) {
      const updatedSession = await updateSession(sessionId, (session) => {
        const normalized = normalizeSession(session);
        const runs = (session.runs || []).map((run) =>
          run.id === updated.id ? updated : run
        );
        let plan = normalized.plan;
        let statusValue = normalized.status;
        let requiredApprovals = normalized.requiredApprovals ?? { ...defaultApprovals };
        let pipeline = { ...(normalized.pipeline ?? {}) };
        let lastAnswer = normalized.lastAnswer ?? "";
        let messages = [...(normalized.messages ?? [])];

        if (kind === "plan") {
          if (status === "success") {
            const raw = fs.readFileSync(logPath, "utf-8");
            plan = extractPayloadText(raw);
            const parsed = parseNeedsApproval(plan);
            const hasAny = Object.values(parsed).some(Boolean);
            requiredApprovals = hasAny
              ? parsed
              : inferRequiredApprovals(`${normalized.request}\n${plan}`);
            // Plan 단계만 끝난 상태. 다음 단계 실행 여부는 finish() 밖에서 결정한다.
            statusValue = "idle";
            pipeline = {
              ...pipeline,
              phase: "idle",
              pendingContinue: false
            };
          } else {
            statusValue = "failed";
            pipeline = {
              ...pipeline,
              phase: "done",
              pendingContinue: false
            };
          }
        } else if (kind === "act") {
          const raw = fs.readFileSync(logPath, "utf-8");
          const answer = extractHumanAnswer(raw);
          if (status === "success") {
            lastAnswer = answer;
            if (answer) {
              messages.push({
                id: createId(),
                at: new Date().toISOString(),
                kind: "assistant",
                role: "assistant",
                text: answer,
                runId: updated.id
              });
            }
            // 다음 단계(verify) 여부는 finish() 밖에서 결정한다.
            statusValue = "success";
            pipeline = {
              ...pipeline,
              phase: "idle",
              pendingContinue: false
            };
          } else {
            if (answer) {
              messages.push({
                id: createId(),
                at: new Date().toISOString(),
                kind: "assistant",
                role: "assistant",
                text: answer,
                runId: updated.id
              });
            }
            statusValue = "failed";
            pipeline = {
              ...pipeline,
              phase: "done",
              pendingContinue: false
            };
          }
        } else if (kind === "verify") {
          const raw = fs.readFileSync(logPath, "utf-8");
          const verifyText = extractHumanAnswer(raw);
          if (verifyText) {
            messages.push({
              id: createId(),
              at: new Date().toISOString(),
              kind: "assistant",
              role: "assistant",
              text: verifyText,
              runId: updated.id
            });
          }
          statusValue = status === "success" ? "success" : "failed";
          pipeline = {
            ...pipeline,
            phase: "done",
            pendingContinue: false
          };
        }
        return {
          ...normalized,
          status: statusValue,
          plan,
          requiredApprovals,
          pipeline,
          lastAnswer,
          messages,
          runs
        };
      });

      // 자동 파이프라인: plan 성공 -> act -> (조건부) verify
      if (status === "success" && kind === "plan") {
        const after = normalizeSession(updatedSession);
        const planOnly = Boolean(after.pipeline?.planOnly);
        const approvalsOk = approvalsSatisfied(after.requiredApprovals, after.approvals);

        if (planOnly) {
          await updateSession(sessionId, (s) => ({
            ...normalizeSession(s),
            pipeline: {
              ...(s.pipeline ?? {}),
              phase: "idle",
              pendingContinue: true
            }
          }));
          await appendMessage(sessionId, {
            role: "assistant",
            kind: "assistant",
            text: "계획이 준비되었습니다. 실행 단계에서 '나머지 실행(Act+Verify)' 버튼을 눌러주세요."
          });
          return;
        }

        if (!approvalsOk) {
          await updateSession(sessionId, (s) => ({
            ...normalizeSession(s),
            pipeline: {
              ...(s.pipeline ?? {}),
              phase: "needs_approval",
              pendingContinue: true
            }
          }));
          await appendMessage(sessionId, {
            role: "assistant",
            kind: "assistant",
            text: "승인이 필요한 작업이 포함되어 자동 실행을 멈췄습니다. 승인 탭에서 체크 후 '나머지 실행'을 눌러주세요."
          });
          return;
        }

        if (!state.active) {
          const session = await loadSession(sessionId);
          const contextPrefix = await buildContextPrefix(session);
          const actPrompt = buildActPrompt({
            request: session.request,
            plan: session.plan,
            approvals: session.approvals,
            contextPrefix
          });
          await startRun({
            prompt: actPrompt,
            modelId: session.modelId,
            kind: "act",
            sessionId
          });
        }
        return;
      }

      if (status === "success" && kind === "act") {
        const session = await loadSession(sessionId);
        const verifyCmd = await loadVerifyCommand();
        const before = session.pipeline?.gitStatusBeforeAct ?? null;
        const after = await getGitStatusSnapshot();
        const changedSinceAct = before !== null && after !== null ? before !== after : false;
        const shouldVerify = Boolean(verifyCmd) && changedSinceAct;

        if (!shouldVerify) {
          const now = new Date();
          const entry = `- [${now.toISOString().slice(0, 10)}] ${toOneLine(
            session.title,
            60
          )}: ${toOneLine(session.request, 120)} -> ${toOneLine(session.lastAnswer, 180)}`;
          await updateSessionMemory(sessionId, entry);
          await updateGlobalMemory(entry);
          await updateSession(sessionId, (s) => ({
            ...normalizeSession(s),
            pipeline: { ...(s.pipeline ?? {}), phase: "done", pendingContinue: false }
          }));
          return;
        }

        if (!state.active) {
          const contextPrefix = await buildContextPrefix(session);
          const verifyPrompt = buildVerifyPrompt({
            request: session.request,
            plan: session.plan,
            verifyCmd,
            contextPrefix
          });
          await startRun({
            prompt: verifyPrompt,
            modelId: session.modelId,
            kind: "verify",
            sessionId
          });
        }
        return;
      }

      if (kind === "verify") {
        const session = await loadSession(sessionId);
        const now = new Date();
        const entry = `- [${now.toISOString().slice(0, 10)}] ${toOneLine(
          session.title,
          60
        )}: ${toOneLine(session.request, 120)} -> ${toOneLine(session.lastAnswer, 180)}`;
        await updateSessionMemory(sessionId, entry);
        await updateGlobalMemory(entry);
        return;
      }
    }
  };

  agent.on("close", (code) => {
    finish(code === 0 ? "success" : "failed", code).catch(() => {});
  });

  agent.on("error", () => {
    finish("failed", 1).catch(() => {});
  });

  return meta;
};

app.get("/api/health", async (_req, res) => {
  res.json({ ok: true, running: Boolean(state.active) });
});

app.get("/api/config", async (_req, res) => {
  try {
    const cfg = await loadConfig();
    const models = await listModels();
    const presets = await getPresetMap();
    const workspaceDir = cfg?.agents?.defaults?.workspace ?? WORKSPACE;
    const sandboxRoot = cfg?.agents?.defaults?.sandbox?.workspaceRoot ?? null;
    const gateway = cfg?.gateway ?? {};
    res.json({
      workspaceDir,
      sandboxRoot,
      gateway: {
        port: gateway.port,
        bind: gateway.bind,
        mode: gateway.mode,
        authMode: gateway?.auth?.mode,
        authToken: maskToken(gateway?.auth?.token),
        remoteUrl: gateway?.remote?.url ?? null,
        remoteToken: maskToken(gateway?.remote?.token)
      },
      models,
      presets
    });
  } catch {
    res.status(500).json({ error: "failed_to_load_config" });
  }
});

app.get("/api/models", async (_req, res) => {
  try {
    const models = await listModels();
    res.json({ models });
  } catch {
    res.status(500).json({ error: "failed_to_load_models" });
  }
});

app.get("/api/sessions", async (_req, res) => {
  const sessions = await listSessions();
  res.json(sessions);
});

app.get("/api/sessions/:id", async (req, res) => {
  try {
    const session = await loadSession(req.params.id);
    res.json(session);
  } catch {
    res.status(404).json({ error: "not_found" });
  }
});

app.post("/api/chat/new", async (req, res) => {
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }
  try {
    const modelPreset = String(req.body?.mode ?? req.body?.modelPreset ?? "assistant");
    const modelId = String(req.body?.modelId ?? "").trim();
    const presets = await getPresetMap();
    const effectiveModel = modelId || presets[modelPreset] || modelId;
    const session = await createSession({
      title: "New chat",
      request: "",
      modelPreset,
      modelId: effectiveModel,
      approvals: req.body?.approvals
    });
    res.json({ session });
  } catch {
    res.status(500).json({ error: "failed_to_create" });
  }
});

app.post("/api/chat/send", async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  const incomingSessionId = String(req.body?.sessionId ?? "").trim();
  const modelPreset = String(req.body?.mode ?? req.body?.modelPreset ?? "assistant");
  const modelId = String(req.body?.modelId ?? "").trim();
  const planMode = Boolean(req.body?.planMode);

  if (!message) {
    return res.status(400).json({ error: "message_required" });
  }
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }

  try {
    const presets = await getPresetMap();
    const effectiveModel = modelId || presets[modelPreset] || modelId;

    let sessionId = incomingSessionId;
    if (!sessionId) {
      const session = await createSession({
        request: message,
        modelPreset,
        modelId: effectiveModel,
        approvals: req.body?.approvals
      });
      sessionId = session.id;
      await updateSession(sessionId, (s) => ({
        ...normalizeSession(s),
        pipeline: {
          ...(s.pipeline ?? {}),
          planOnly: planMode,
          auto: !planMode,
          phase: "planning",
          pendingContinue: false
        }
      }));
    } else {
      await appendMessage(sessionId, { role: "user", kind: "user", text: message });
      await updateSession(sessionId, (s) => {
        const normalized = normalizeSession(s);
        const title = normalized.title && normalized.title !== "New chat"
          ? normalized.title
          : message.slice(0, 60) || "New chat";
        return {
          ...normalized,
          title,
          status: "planning",
          request: message,
          modelPreset,
          modelId: effectiveModel,
          approvals: { ...normalized.approvals, ...(req.body?.approvals ?? {}) },
          pipeline: {
            ...(normalized.pipeline ?? {}),
            planOnly: planMode,
            auto: !planMode,
            phase: "planning",
            pendingContinue: false
          }
        };
      });
    }

    const session = await loadSession(sessionId);
    const contextPrefix = await buildContextPrefix(session);
    const { text: rewrittenPrompt, rewritten } = rewriteWorkspacePaths(message);
    const planPrompt = buildPlanPrompt({
      request: rewrittenPrompt,
      contextPrefix
    });

    const run = await startRun({
      prompt: planPrompt,
      modelId: effectiveModel,
      kind: "plan",
      sessionId
    });

    res.json({ session: await loadSession(sessionId), run, rewritten });
  } catch {
    res.status(500).json({ error: "failed_to_start" });
  }
});

app.post("/api/chat/continue", async (req, res) => {
  const sessionId = String(req.body?.sessionId ?? "").trim();
  const planOverride = String(req.body?.plan ?? "").trim();
  const approvals = req.body?.approvals ?? {};

  if (!sessionId) {
    return res.status(400).json({ error: "session_required" });
  }
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }

  try {
    const session = await loadSession(sessionId);
    const effectiveModel = String(req.body?.modelId ?? session.modelId ?? "");

    const nextPlan = planOverride || session.plan || "";
    await updateSession(sessionId, (current) => ({
      ...normalizeSession(current),
      plan: nextPlan,
      planEdited: Boolean(planOverride) && planOverride !== (current.plan ?? ""),
      approvals: { ...current.approvals, ...approvals },
      pipeline: {
        ...(current.pipeline ?? {}),
        planOnly: false,
        auto: true,
        pendingContinue: false
      }
    }));

    const refreshed = await loadSession(sessionId);
    const approvalsOk = approvalsSatisfied(refreshed.requiredApprovals, refreshed.approvals);
    if (!approvalsOk) {
      await updateSession(sessionId, (s) => ({
        ...normalizeSession(s),
        pipeline: { ...(s.pipeline ?? {}), phase: "needs_approval", pendingContinue: true }
      }));
      return res.status(409).json({ error: "needs_approval" });
    }

    const contextPrefix = await buildContextPrefix(refreshed);
    const { text: rewrittenRequest, rewritten } = rewriteWorkspacePaths(refreshed.request);
    const actPrompt = buildActPrompt({
      request: rewrittenRequest,
      plan: refreshed.plan,
      approvals: refreshed.approvals,
      contextPrefix
    });

    const run = await startRun({
      prompt: actPrompt,
      modelId: effectiveModel,
      kind: "act",
      sessionId
    });
    res.json({ run, rewritten });
  } catch {
    res.status(500).json({ error: "failed_to_start" });
  }
});

app.post("/api/plan", async (req, res) => {
  const request = String(req.body?.request ?? "").trim();
  const modelPreset = String(req.body?.modelPreset ?? "assistant");
  const modelId = String(req.body?.modelId ?? "").trim();
  if (!request) {
    return res.status(400).json({ error: "request_required" });
  }
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }
  try {
    const presets = await getPresetMap();
    const effectiveModel = modelId || presets[modelPreset] || modelId;
    const session = await createSession({
      request,
      modelPreset,
      modelId: effectiveModel,
      approvals: req.body?.approvals
    });
    const { text: rewrittenPrompt, rewritten } = rewriteWorkspacePaths(request);
    const contextPrefix = await buildContextPrefix(session);
    const planPrompt = buildPlanPrompt({ request: rewrittenPrompt, contextPrefix });
    const run = await startRun({
      prompt: planPrompt,
      modelId: effectiveModel,
      kind: "plan",
      sessionId: session.id
    });
    res.json({ session, run, rewritten });
  } catch {
    res.status(500).json({ error: "failed_to_start" });
  }
});

app.post("/api/act", async (req, res) => {
  const sessionId = String(req.body?.sessionId ?? "").trim();
  const plan = String(req.body?.plan ?? "").trim();
  const approvals = req.body?.approvals ?? {};
  if (!sessionId) {
    return res.status(400).json({ error: "session_required" });
  }
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }
  try {
    const session = await loadSession(sessionId);
    const effectiveModel = String(req.body?.modelId ?? session.modelId ?? "");
    const { text: rewrittenRequest, rewritten } = rewriteWorkspacePaths(
      session.request
    );
    const contextPrefix = await buildContextPrefix(session);
    const actPrompt = buildActPrompt({
      request: rewrittenRequest,
      plan,
      approvals,
      contextPrefix
    });
    await updateSession(sessionId, (current) => ({
      ...current,
      plan,
      planEdited: plan !== (current.plan ?? ""),
      approvals: { ...current.approvals, ...approvals }
    }));
    const run = await startRun({
      prompt: actPrompt,
      modelId: effectiveModel,
      kind: "act",
      sessionId
    });
    res.json({ run, rewritten });
  } catch {
    res.status(500).json({ error: "failed_to_start" });
  }
});

app.get("/api/runs", async (_req, res) => {
  const runs = await listRuns();
  res.json(runs);
});

app.get("/api/runs/:id", async (req, res) => {
  const metaPath = path.join(RUNS_DIR, `${req.params.id}.json`);
  try {
    const meta = await readJson(metaPath);
    res.json(meta);
  } catch {
    res.status(404).json({ error: "not_found" });
  }
});

app.get("/api/runs/:id/summary", async (req, res) => {
  try {
    const logPath = path.join(RUNS_DIR, `${req.params.id}.log`);
    const raw = await fsp.readFile(logPath, "utf-8");
    const summary = extractRunSummary(raw);
    res.json(summary);
  } catch {
    res.status(404).json({ error: "not_found" });
  }
});

app.get("/api/runs/:id/log", async (req, res) => {
  const offset = Number(req.query.offset ?? 0);
  const logPath = path.join(RUNS_DIR, `${req.params.id}.log`);
  const chunk = await readLogChunk(logPath, Number.isNaN(offset) ? 0 : offset);
  res.json(chunk);
});

app.get("/api/runs/:id/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  let offset = Number(req.query.offset ?? 0);
  if (Number.isNaN(offset)) offset = 0;
  let closed = false;

  const logPath = path.join(RUNS_DIR, `${req.params.id}.log`);
  const metaPath = path.join(RUNS_DIR, `${req.params.id}.json`);

  const send = (event, payload) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const timer = setInterval(async () => {
    if (closed) return;
    const chunk = await readLogChunk(logPath, offset);
    if (chunk.data) {
      send("log", { data: chunk.data, nextOffset: chunk.nextOffset });
      offset = chunk.nextOffset;
    }
    if (chunk.eof) {
      try {
        const meta = await readJson(metaPath);
        if (meta.status !== "running") {
          send("done", { status: meta.status });
          clearInterval(timer);
          res.end();
        }
      } catch {
        // ignore
      }
    }
  }, 1000);

  req.on("close", () => {
    closed = true;
    clearInterval(timer);
  });
});

app.get("/api/runs/:id/tools", async (req, res) => {
  const metaPath = path.join(RUNS_DIR, `${req.params.id}.json`);
  try {
    const meta = await readJson(metaPath);
    const logPath = meta.gatewayLogPath ?? getGatewayLogPath();
    const raw = await readTail(logPath, 2_000_000);
    let events = parseToolEvents(raw);

    if (!events.length) {
      const openclawDir = OPENCLAW_LOG_DIR;
      const files = await fsp.readdir(openclawDir).catch(() => []);
      const candidates = files
        .filter((name) => name.startsWith("openclaw-") && name.endsWith(".log"))
        .map((name) => path.join(openclawDir, name))
        .sort();
      const sessionId = `ui-${req.params.id}`;
      for (const candidate of candidates.reverse()) {
        const tail = await readTail(candidate, 2_000_000);
        const runId = findRunIdForSession(tail, sessionId);
        if (!runId) continue;
        events = parseToolEvents(tail, runId);
        if (events.length) break;
      }
    }

    res.json({ events });
  } catch {
    res.status(404).json({ error: "not_found" });
  }
});

app.get("/api/runs/:id/artifacts", async (_req, res) => {
  try {
    const diffArtifacts = await getDiffArtifacts();
    res.json({
      files: diffArtifacts.files,
      diff: diffArtifacts.diff
    });
  } catch {
    res.status(500).json({ error: "failed_to_collect_artifacts" });
  }
});

app.get("/api/fs/list", async (req, res) => {
  try {
    const inputPath = String(req.query.path ?? "");
    const resolved = resolveClientPath(inputPath);
    const entries = await fsp.readdir(resolved, { withFileTypes: true });
    const result = entries.map((entry) => ({
      name: entry.name,
      path: toClientPath(path.join(resolved, entry.name)),
      type: entry.isDirectory() ? "dir" : "file"
    }));
    res.json({
      path: toClientPath(resolved),
      entries: result
    });
  } catch (err) {
    res.status(400).json({ error: "invalid_path" });
  }
});

app.get("/api/fs/read", async (req, res) => {
  try {
    const inputPath = String(req.query.path ?? "");
    const resolved = resolveClientPath(inputPath);
    const stat = await fsp.stat(resolved);
    if (!stat.isFile()) {
      return res.status(400).json({ error: "not_a_file" });
    }
    const limit = Math.min(Number(req.query.limit ?? 20000), 200000);
    const handle = await fsp.open(resolved, "r");
    const buffer = Buffer.alloc(limit);
    const { bytesRead } = await handle.read(buffer, 0, limit, 0);
    await handle.close();
    res.json({
      path: toClientPath(resolved),
      content: buffer.slice(0, bytesRead).toString("utf-8")
    });
  } catch {
    res.status(400).json({ error: "invalid_path" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

const PORT = Number(process.env.PORT ?? 4310);

ensureDirs().then(() => {
  app.listen(PORT, () => {
    console.log(`OpenClaw UI server listening on ${PORT}`);
  });
});
