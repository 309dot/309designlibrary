import express from "express";
import cors from "cors";
import { spawn } from "child_process";
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

const OPENCLAW_BIN =
  process.env.OPENCLAW_BIN ?? "/Users/a309/.openclaw/bin/openclaw";
const OPENCLAW_CONFIG =
  process.env.OPENCLAW_CONFIG ??
  "/Users/a309/Documents/Agent309/wOpenclaw/.openclaw-state/openclaw.json";
const OPENCLAW_STATE_DIR =
  process.env.OPENCLAW_STATE_DIR ??
  "/Users/a309/Documents/Agent309/wOpenclaw/.openclaw-state";
const OPENCLAW_GATEWAY_PORT =
  Number(process.env.OPENCLAW_GATEWAY_PORT ?? 19011);

const state = {
  active: null
};

const MAX_LOG_BYTES = 200_000;

const ensureDirs = async () => {
  await fsp.mkdir(RUNS_DIR, { recursive: true });
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

const createTempConfig = async (modelId, runId) => {
  if (!modelId) return null;
  const cfg = await loadConfig();
  if (!cfg?.agents?.defaults) return null;
  cfg.agents.defaults.model = cfg.agents.defaults.model ?? {};
  cfg.agents.defaults.model.primary = `ollama/${modelId}`;

  const tempPath = path.join(RUNS_DIR, `${runId}.config.json`);
  await fsp.writeFile(tempPath, JSON.stringify(cfg, null, 2));
  return tempPath;
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

const tryRecoverRun = async (metaPath, meta) => {
  if (meta.status !== "running") return meta;
  if (meta.recoveredFrom) return meta;

  const createdAt = Date.parse(meta.createdAt || "");
  if (!Number.isNaN(createdAt) && Date.now() - createdAt < 20_000) {
    return meta;
  }

  const logStat = await fsp.stat(meta.logPath).catch(() => null);
  if (logStat && logStat.size > 0) return meta;

  const lastTried = meta.recoveryTriedAt ? Date.parse(meta.recoveryTriedAt) : 0;
  if (lastTried && Date.now() - lastTried < 15_000) {
    return meta;
  }

  const sessionId = `ui-${meta.id}`;
  const openclawDir = "/tmp/openclaw";
  const files = await fsp.readdir(openclawDir).catch(() => []);
  const candidates = files
    .filter((name) => name.startsWith("openclaw-") && name.endsWith(".log"))
    .map((name) => path.join(openclawDir, name));

  for (const filePath of candidates.reverse()) {
    const tail = await readTail(filePath);
    if (!tail.includes(sessionId)) continue;
    const lines = tail.split("\n");
    for (const line of lines) {
      if (!line.includes(sessionId)) continue;
      if (!line.includes("payloads")) continue;
      try {
        const parsed = JSON.parse(line);
        const raw = parsed?.["0"];
        if (!raw || typeof raw !== "string") continue;
        const payload = JSON.parse(raw);
        const text =
          payload?.result?.payloads?.[0]?.text ??
          payload?.result?.payloads?.[0]?.content?.text ??
          null;
        if (!text) continue;

        await fsp.writeFile(meta.logPath, text + "\n");
        const updated = {
          ...meta,
          status: "success",
          exitCode: 0,
          completedAt: new Date().toISOString(),
          durationMs: payload?.result?.meta?.durationMs ?? null,
          recoveryTried: true,
          recoveryTriedAt: new Date().toISOString(),
          recoveredFrom: filePath
        };
        await writeJson(metaPath, updated);
        if (state.active?.id === meta.id) {
          state.active = null;
        }
        return updated;
      } catch {
        // ignore parse errors
      }
    }
  }

  const updated = {
    ...meta,
    recoveryTried: true,
    recoveryTriedAt: new Date().toISOString()
  };
  await writeJson(metaPath, updated);
  return updated;
};

const createId = () => {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const rnd = crypto.randomBytes(2).toString("hex");
  return `${stamp}-${rnd}`;
};

const readJson = async (filePath) => {
  const raw = await fsp.readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

const writeJson = async (filePath, data) => {
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2));
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
      const recovered = await tryRecoverRun(metaPath, meta);
      metas.push(recovered);
    } catch {
      // ignore invalid files
    }
  }
  metas.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return metas;
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

const startRun = async (prompt, modelId) => {
  await ensureDirs();
  await fsp.access(OPENCLAW_BIN);
  await fsp.access(OPENCLAW_CONFIG);

  const id = createId();
  const createdAt = new Date().toISOString();
  const logPath = path.join(RUNS_DIR, `${id}.log`);
  const gatewayLogPath = path.join(RUNS_DIR, `${id}.gateway.log`);
  const metaPath = path.join(RUNS_DIR, `${id}.json`);

  const tempConfigPath = await createTempConfig(modelId, id);

  const meta = {
    id,
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

  const env = {
    ...process.env,
    OPENCLAW_STATE_DIR,
    OPENCLAW_CONFIG_PATH: tempConfigPath ?? OPENCLAW_CONFIG
  };

  const gatewayOut = fs.createWriteStream(gatewayLogPath, { flags: "a" });
  const agentOut = fs.createWriteStream(logPath, { flags: "a" });

  const gateway = spawn(
    OPENCLAW_BIN,
    ["gateway", "--port", String(OPENCLAW_GATEWAY_PORT), "--bind", "loopback"],
    { env }
  );
  gateway.stdout.pipe(gatewayOut);
  gateway.stderr.pipe(gatewayOut);

  state.active = { id, gateway, agent: null, metaPath };

  const startAt = Date.now();

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const agent = spawn(
    OPENCLAW_BIN,
    ["agent", "--session-id", `ui-${id}`, "--message", prompt, "--json"],
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
    gateway.kill();
    gatewayOut.end();
    agentOut.end();
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

app.get("/api/models", async (_req, res) => {
  try {
    const models = await listModels();
    res.json({ models });
  } catch {
    res.status(500).json({ error: "failed_to_load_models" });
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

app.get("/api/runs/:id/log", async (req, res) => {
  const offset = Number(req.query.offset ?? 0);
  const logPath = path.join(RUNS_DIR, `${req.params.id}.log`);
  const chunk = await readLogChunk(logPath, Number.isNaN(offset) ? 0 : offset);
  res.json(chunk);
});

app.post("/api/run", async (req, res) => {
  const prompt = String(req.body?.prompt ?? "").trim();
  const modelId = String(req.body?.modelId ?? "").trim();
  if (!prompt) {
    return res.status(400).json({ error: "prompt_required" });
  }
  if (state.active) {
    return res.status(409).json({ error: "already_running" });
  }
  try {
    const meta = await startRun(prompt, modelId || null);
    res.json(meta);
  } catch (err) {
    res.status(500).json({ error: "failed_to_start" });
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
