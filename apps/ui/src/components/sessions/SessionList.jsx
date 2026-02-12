import React from "react";

const statusLabels = {
  idle: "대기",
  planning: "계획",
  running: "실행 중",
  success: "완료",
  failed: "실패"
};

const statusClass = (status) => {
  if (status === "planning") return "planning";
  if (status === "running") return "running";
  if (status === "success") return "success";
  if (status === "failed") return "failed";
  return "idle";
};

const formatTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default function SessionList({
  sessions,
  activeId,
  searchTerm,
  statusFilter,
  onSearch,
  onFilter,
  onSelect,
  debugEnabled,
  onToggleDebug,
  mode,
  showMeta
}) {
  const filtered = sessions.filter((session) => {
    const query = searchTerm.trim().toLowerCase();
    const statusMatch = statusFilter === "all" ? true : session.status === statusFilter;
    if (!statusMatch) return false;
    if (!query) return true;
    return (
      session.id.toLowerCase().includes(query) ||
      (session.title || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="session-list">
      <div className="brand">
        <div className="brand-title">OpenClaw Command</div>
        <div className="brand-sub">로컬 에이전트 제어 콘솔</div>
      </div>
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="세션 검색 (ID/제목)"
        />
      </div>
      <div className="filter-row compact">
        <button className="filter-button active">
          {statusFilter === "all" ? "전체" : statusFilter}
        </button>
      </div>
      <div className="panel-section">
        <div className="panel-title">Sessions</div>
        <div className="run-list">
          {filtered.length === 0 && (
            <div className="empty">아직 실행 기록이 없습니다.</div>
          )}
          {filtered.map((session) => (
            <button
              key={session.id}
              className={`run-card ${activeId === session.id ? "active" : ""}`}
              onClick={() => onSelect(session.id)}
            >
              <div className="run-title">{session.title || "(제목 없음)"}</div>
              <div className="run-snippet">
                {(
                  (session.lastAnswer || session.request || "")
                    .split("\n")[0]
                    ?.slice(0, 80) || ""
                )}
              </div>
              {showMeta ? (
                <div className="run-row meta">
                  <span className="run-id">{session.id}</span>
                  <span className={`status ${statusClass(session.status)}`}>
                    {statusLabels[session.status] ?? "대기"}
                  </span>
                  <span className="run-time">{formatTime(session.createdAt)}</span>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="debug-toggle-row">
        <button
          className={`debug-toggle ${debugEnabled ? "active" : ""} ${mode || "assistant"}`}
          onClick={onToggleDebug}
          title="Debug 모드"
        >
          DBG
        </button>
      </div>
    </div>
  );
}
