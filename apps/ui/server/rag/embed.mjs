const cosineSimilarity = (a, b) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
};

const embedOne = async ({ baseUrl, model, text, timeoutMs = 5000 }) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(`${baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: text }),
      signal: controller.signal
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      return { ok: false, error: "embeddings_failed", detail: t.slice(0, 400) };
    }
    const data = await resp.json().catch(() => null);
    const emb = data?.embedding;
    if (!Array.isArray(emb)) {
      return { ok: false, error: "bad_embedding", detail: JSON.stringify(data)?.slice(0, 400) };
    }
    return { ok: true, embedding: emb };
  } catch (err) {
    return { ok: false, error: "embeddings_error", detail: String(err?.message ?? err) };
  } finally {
    clearTimeout(timer);
  }
};

export const rankChunksByEmbedding = async ({
  query,
  chunks,
  baseUrl = "http://127.0.0.1:11434",
  model = "nomic-embed-text",
  topK = 6
}) => {
  const q = await embedOne({ baseUrl, model, text: query });
  if (!q.ok) return { ok: false, error: q.error, detail: q.detail };

  const vectors = [];
  for (const c of chunks) {
    const out = await embedOne({ baseUrl, model, text: c });
    if (!out.ok) return { ok: false, error: out.error, detail: out.detail };
    vectors.push(out.embedding);
  }

  const scored = chunks.map((c, i) => ({
    index: i,
    score: cosineSimilarity(q.embedding, vectors[i]),
    text: c
  }));

  scored.sort((a, b) => b.score - a.score);
  return { ok: true, picked: scored.slice(0, Math.min(topK, scored.length)) };
};

