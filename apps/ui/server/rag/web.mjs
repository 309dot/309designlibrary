import crypto from "crypto";
import { execFile } from "child_process";

const isIpv4 = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host);

const isPrivateIpv4 = (host) => {
  if (!isIpv4(host)) return false;
  const parts = host.split(".").map((n) => Number(n));
  if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
};

export const extractUrls = (text, limit = 3) => {
  const s = String(text ?? "");
  const matches = s.match(/https?:\/\/[^\s)>\"]+/g) ?? [];
  const uniq = [];
  const seen = new Set();
  for (const m of matches) {
    const cleaned = m.replace(/[),.]+$/, "");
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);
    uniq.push(cleaned);
    if (uniq.length >= limit) break;
  }
  return uniq;
};

export const validateRemoteUrl = (urlStr) => {
  let url;
  try {
    url = new URL(String(urlStr ?? ""));
  } catch {
    return { ok: false, error: "invalid_url" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "blocked_protocol" };
  }
  const host = url.hostname.toLowerCase();
  if (!host) return { ok: false, error: "invalid_host" };
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    return { ok: false, error: "blocked_localhost" };
  }
  if (host.endsWith(".local")) return { ok: false, error: "blocked_local_domain" };
  if (isPrivateIpv4(host)) return { ok: false, error: "blocked_private_ip" };
  return { ok: true, url };
};

const stripHtml = (html) => {
  let s = String(html ?? "");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  s = s.replace(/<[^>]+>/g, "\n");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
};

export const hashUrl = (urlStr) =>
  crypto.createHash("sha256").update(String(urlStr ?? "")).digest("hex").slice(0, 16);

export const fetchWebDocument = async (urlStr, { timeoutMs = 10_000 } = {}) => {
  const v = validateRemoteUrl(urlStr);
  if (!v.ok) return { ok: false, error: v.error };
  const url = v.url;

  try {
    // Node fetch may fail on some macOS setups due to local CA issues.
    // Use curl (system trust store) for robustness.
    const body = await new Promise((resolve, reject) => {
      const timeoutSec = Math.max(1, Math.round(timeoutMs / 1000));
      execFile(
        "curl",
        [
          "-L",
          "-sS",
          "--compressed",
          "--max-time",
          String(timeoutSec),
          url.toString()
        ],
        { maxBuffer: 20 * 1024 * 1024 },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(stderr?.toString() || err.message));
            return;
          }
          resolve(stdout?.toString() ?? "");
        }
      );
    });
    const title =
      body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? url.hostname;
    const text = stripHtml(body);
    return { ok: true, url: url.toString(), title, text };
  } catch (err) {
    return { ok: false, error: "fetch_failed", detail: String(err?.message ?? err) };
  }
};
