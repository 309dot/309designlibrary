import React from "react";

export default function SessionList({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onClose,
  collapsed
}) {
  return (
    <div className="session-list">
      <div className="threads-header">
        <div className="threads-title">Threads</div>
        <div className="threads-actions">
          <button className="ghost icon-button" onClick={onNewChat} title="새 세션">
            ＋
          </button>
          <button
            className="ghost icon-button"
            onClick={() => onClose?.()}
            title="Threads 닫기"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="threads-list">
        {sessions.length === 0 ? <div className="empty">세션이 없습니다.</div> : null}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`thread-row ${activeId === session.id ? "active" : ""}`}
          >
            <button
              className="thread-main"
              onClick={() => onSelect(session.id)}
              title={session.title || session.id}
            >
              <span className="thread-title">{session.title || "New chat"}</span>
            </button>
            <button
              className="ghost icon-button thread-more"
              title="세션 삭제"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(session.id);
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
