import React, { useMemo } from "react";

const phaseLabel = (phase) => {
  if (phase === "planning") return "계획 생성 중…";
  if (phase === "acting") return "실행 중…";
  if (phase === "verifying") return "검증 중…";
  if (phase === "needs_approval") return "승인 필요";
  if (phase === "done") return "완료";
  return "대기";
};

export default function ChatThread({
  title,
  messages,
  phase,
  status,
  notice,
  onOpenSteps
}) {
  const phaseChip = useMemo(() => phaseLabel(phase), [phase]);
  const typing = phase === "planning" || phase === "acting" || phase === "verifying";

  return (
    <div className="chat-thread">
      <div className="chat-meta">
        <span className="phase-chip">{phaseChip}</span>
        <button className="ghost tiny" onClick={onOpenSteps}>
          단계 보기
        </button>
      </div>

      {notice ? <div className="system-note">{notice}</div> : null}

      {Array.isArray(messages) && messages.length ? (
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id || `${m.at}-${m.role}`} className={`message ${m.role}`}>
              <div className="bubble">
                {m.role === "assistant" ? (
                  <div className="assistant-title">{title || "OpenClaw"}</div>
                ) : null}
                <div className="assistant-body prewrap">{m.text || ""}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty chat-empty">
          메시지를 입력하고 <span className="mono small">Cmd+Enter</span>로 보내세요.
        </div>
      )}

      {typing ? <div className="typing">생각 중…</div> : null}

      {status === "failed" ? (
        <div className="hint">실패했습니다. 실행 단계에서 로그를 확인하세요.</div>
      ) : null}
    </div>
  );
}

