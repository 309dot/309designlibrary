import React from "react";
import AdvancedPanel from "./AdvancedPanel.jsx";

const tabs = [
  { key: "tools", label: "Tool Calls" },
  { key: "terminal", label: "Terminal" },
  { key: "files", label: "Files" },
  { key: "diff", label: "Diff" },
  { key: "logs", label: "Logs" }
];

export default function Inspector({
  activeTab,
  onTabChange,
  toolEvents,
  terminalText,
  diffText,
  files,
  fsPath,
  fsEntries,
  filePreview,
  onNavigate,
  onOpenFile,
  logs,
  logFilter,
  onLogFilterChange,
  advancedOpen,
  onAdvancedToggle,
  config,
  summary
}) {
  return (
    <div className="inspector">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tools" && (
        <div className="inspector-log">
          {toolEvents.length === 0 ? (
            <div className="empty">tool 이벤트가 아직 없습니다.</div>
          ) : (
            <div className="tool-events">
              {toolEvents.map((event, index) => (
                <div className="tool-card" key={`${event.toolCallId}-${index}`}>
                  <div className="tool-row">
                    <span className={`tool-kind ${event.kind}`}>
                      {event.kind}
                    </span>
                    <span className="tool-name">{event.tool || "-"}</span>
                    <span className="tool-time">{event.at || "-"}</span>
                  </div>
                  <div className="tool-meta">
                    <span className="mono">{event.toolCallId || "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "terminal" && (
        <div className="inspector-log">
          <pre className="log">{terminalText || "터미널 로그가 없습니다."}</pre>
        </div>
      )}

      {activeTab === "files" && (
        <div className="files-panel">
          <div className="files-header">
            <button className="ghost" onClick={() => onNavigate("..")}>상위</button>
            <span className="mono">{fsPath}</span>
          </div>
          <div className="files-list">
            {fsEntries.map((entry) => (
              <button
                key={entry.path}
                className={`file-item ${entry.type}`}
                onClick={() => onOpenFile(entry)}
              >
                <span>{entry.type === "dir" ? "📁" : "📄"}</span>
                <span>{entry.name}</span>
              </button>
            ))}
          </div>
          <div className="files-preview">
            <div className="panel-title">Preview</div>
            <pre className="log">{filePreview || "파일을 선택하세요."}</pre>
          </div>
        </div>
      )}

      {activeTab === "diff" && (
        <div className="inspector-log">
          <div className="diff-summary">
            <div className="panel-title">변경 파일</div>
            {files.length === 0 ? (
              <div className="empty">변경된 파일이 없습니다.</div>
            ) : (
              <ul className="diff-files">
                {files.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            )}
          </div>
          <pre className="log">{diffText || "diff가 없습니다."}</pre>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="inspector-log">
          <div className="log-filters">
            {[
              { key: "error", label: "에러" },
              { key: "warn", label: "경고" },
              { key: "tool", label: "툴" },
              { key: "agent", label: "에이전트" }
            ].map((item) => (
              <label key={item.key} className="filter-chip">
                <input
                  type="checkbox"
                  checked={logFilter[item.key]}
                  onChange={() => onLogFilterChange(item.key)}
                />
                {item.label}
              </label>
            ))}
          </div>
          <pre className="log">{logs || "로그가 없습니다."}</pre>
        </div>
      )}

      <AdvancedPanel
        open={advancedOpen}
        onToggle={onAdvancedToggle}
        config={config}
        summary={summary}
      />
    </div>
  );
}
