import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIR = process.env.UI_LOG_DIR ?? "/Users/a309/Documents/Agent309/wOpenclaw/apps/ui/.data";
const LOG_PATH = path.join(LOG_DIR, "ui-server.log");

fs.mkdirSync(LOG_DIR, { recursive: true });
const out = fs.createWriteStream(LOG_PATH, { flags: "a" });

const child = spawn(process.execPath, [path.join(__dirname, "index.mjs")], {
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  detached: true
});

child.stdout.pipe(out);
child.stderr.pipe(out);
child.unref();
