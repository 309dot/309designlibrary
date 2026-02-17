export const chunkText = (text, { maxChars = 2600, minChars = 800 } = {}) => {
  const raw = String(text ?? "").replace(/\r/g, "");
  const paras = raw
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let buf = "";

  const push = () => {
    const trimmed = buf.trim();
    if (trimmed) chunks.push(trimmed);
    buf = "";
  };

  for (const p of paras) {
    if (!buf) {
      buf = p;
      continue;
    }
    if (buf.length + 1 + p.length <= maxChars) {
      buf += `\n${p}`;
      continue;
    }
    if (buf.length >= minChars) {
      push();
      buf = p;
      continue;
    }
    // If the current buffer is too small, force-add and push.
    buf += `\n${p}`;
    push();
  }
  push();
  return chunks;
};

