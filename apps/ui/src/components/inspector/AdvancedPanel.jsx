import React from "react";

export default function AdvancedPanel({ open, onToggle, config, summary }) {
  const injected = summary?.systemPrompt?.injectedFiles ?? [];
  return (
    <div className="advanced-panel">
      <button className={`ghost advanced-toggle ${open ? "open" : ""}`} onClick={onToggle}>
        Advanced
      </button>
      {open && (
        <div className="advanced-content">
          <div className="panel-title">Gateway</div>
          <div className="info-grid">
            <span>모드</span>
            <span>{config?.gateway?.mode || "-"}</span>
            <span>바인드</span>
            <span>{config?.gateway?.bind || "-"}</span>
            <span>포트</span>
            <span>{config?.gateway?.port || "-"}</span>
            <span>토큰</span>
            <span className="mono">{config?.gateway?.authToken || "-"}</span>
            <span>Remote</span>
            <span className="mono">{config?.gateway?.remoteUrl || "-"}</span>
          </div>

          <div className="panel-title">Sandbox</div>
          <div className="info-grid">
            <span>Workspace</span>
            <span className="mono">{config?.workspaceDir || "-"}</span>
            <span>Root</span>
            <span className="mono">{config?.sandboxRoot || "-"}</span>
          </div>

          <div className="panel-title">Token Usage</div>
          <div className="info-grid">
            <span>Input</span>
            <span>{summary?.usage?.input ?? "-"}</span>
            <span>Output</span>
            <span>{summary?.usage?.output ?? "-"}</span>
            <span>Total</span>
            <span>{summary?.usage?.total ?? "-"}</span>
          </div>

          <div className="panel-title">System Prompt</div>
          <div className="info-grid">
            <span>Chars</span>
            <span>{summary?.systemPrompt?.chars ?? "-"}</span>
            <span>Project</span>
            <span>{summary?.systemPrompt?.projectContextChars ?? "-"}</span>
            <span>Non-Project</span>
            <span>{summary?.systemPrompt?.nonProjectContextChars ?? "-"}</span>
          </div>
          <div className="advanced-list">
            {injected.length === 0 && <div className="empty">주입 파일 없음</div>}
            {injected.map((file) => (
              <div className="advanced-item" key={file.path}>
                <span>{file.name}</span>
                <span className="mono">{file.chars}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
