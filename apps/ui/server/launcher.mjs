import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Legacy compat launcher: keep process attached so launchd/systemd can supervise
// a single long-running node process without detached re-spawn loops.
const child = spawn(process.execPath, [path.join(__dirname, "index.mjs")], {
  env: process.env,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
