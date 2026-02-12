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

export default function TopBarMinimal({
  title,
  status,
  leftCollapsed,
  onToggleLeft,
  onNewChat,
  approvalsNeededCount,
  debugEnabled,
  drawerOpen,
  onOpenSteps,
  onOpenApproval,
  onOpenDebug,
  onOpenSettings,
  onCloseDrawer
}) {
  return (
    <header className="topbar-min">
      <div className="topbar-min-left">
        <button
          className="ghost icon-button"
          onClick={onToggleLeft}
          title={leftCollapsed ? "사이드바 열기" : "사이드바 숨기기"}
          aria-pressed={leftCollapsed ? "true" : "false"}
        >
          {leftCollapsed ? "▸" : "◂"}
        </button>
        <button className="ghost icon-button" onClick={onNewChat} title="새 채팅">
          ＋
        </button>
        <div className="brandmark">OpenClaw</div>
        <span className={`status status-min ${statusClass(status)}`}>
          {statusLabels[status] ?? "대기"}
        </span>
      </div>

      <div className="topbar-min-center">
        <div className="chat-title">{title || "New chat"}</div>
      </div>

      <div className="topbar-min-right">
        <button
          className="ghost icon-button"
          onClick={onOpenSteps}
          title="실행 단계"
        >
          ≡
        </button>
        <button
          className="ghost icon-button"
          onClick={onOpenApproval}
          title={`승인 (${approvalsNeededCount})`}
        >
          승인
          {approvalsNeededCount > 0 ? (
            <span className="icon-badge">{approvalsNeededCount}</span>
          ) : null}
        </button>
        <button
          className={`ghost icon-button ${debugEnabled ? "active" : ""}`}
          onClick={onOpenDebug}
          title="Debug"
        >
          DBG
        </button>
        <button
          className="ghost icon-button"
          onClick={onOpenSettings}
          title="설정"
        >
          ⚙︎
        </button>
        {drawerOpen ? (
          <button className="ghost icon-button" onClick={onCloseDrawer} title="패널 닫기">
            ✕
          </button>
        ) : null}
      </div>
    </header>
  );
}
