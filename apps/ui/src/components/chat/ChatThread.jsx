export default function ChatThread({
  messages,
  typing
}) {
  return (
    <div className="chat-thread">
      {Array.isArray(messages) && messages.length ? (
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id || `${m.at}-${m.role}`} className={`message ${m.role}`}>
              <div className="bubble">
                <div className="assistant-body prewrap">{m.text || ""}</div>
                {Array.isArray(m.references) && m.references.length ? (
                  <details className="message-refs">
                    <summary>참고 자료</summary>
                    <div className="refs-list">
                      {m.references.slice(0, 8).map((r, idx) => (
                        <div key={`${idx}-${r.url}`} className="ref-item">
                          <div className="ref-title">
                            {r.title || "문서"}{" "}
                            <span className="mono small">
                              (S{r.source ?? "?"}-{r.chunk ?? "?"})
                            </span>
                          </div>
                          <div className="ref-url mono small">{r.url}</div>
                          {r.snippet ? (
                            <div className="ref-snippet prewrap">{r.snippet}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty chat-empty">
          메시지를 입력하고 <span className="mono small">Cmd+Enter</span>로 보내세요.
        </div>
      )}

      {typing ? <div className="typing">진행 중…</div> : null}
    </div>
  );
}
