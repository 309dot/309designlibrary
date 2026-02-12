import React, { useEffect, useRef } from "react";

export default function OverflowMenu({
  open,
  onClose,
  mode,
  onChangeMode,
  models,
  selectedModel,
  onChangeModel,
  debugEnabled,
  onToggleDebug,
  planMode,
  onTogglePlanMode,
  showSessionMeta,
  onToggleSessionMeta,
  statusFilter,
  onChangeStatusFilter,
  leftCollapsed,
  onToggleLeft,
  onOpenDrawerTab,
  approvalsNeededCount
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    const onClick = (event) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target)) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="menu-popover" role="menu" ref={ref}>
      <div className="menu-section">
        <div className="menu-title">설정</div>

        <label className="menu-row">
          <span>모드</span>
          <select value={mode} onChange={(e) => onChangeMode(e.target.value)}>
            <option value="assistant">비서</option>
            <option value="dev">개발</option>
            <option value="design">설계</option>
          </select>
        </label>

        <label className="menu-row">
          <span>모델</span>
          <select
            value={selectedModel}
            onChange={(e) => onChangeModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.id}
              </option>
            ))}
          </select>
        </label>

        <label className="menu-row">
          <span>Plan 모드</span>
          <input
            type="checkbox"
            checked={Boolean(planMode)}
            onChange={() => onTogglePlanMode?.(!planMode)}
          />
        </label>

        <label className="menu-row">
          <span>Debug</span>
          <input
            type="checkbox"
            checked={Boolean(debugEnabled)}
            onChange={() => onToggleDebug?.(!debugEnabled)}
          />
        </label>
      </div>

      <div className="menu-section">
        <div className="menu-title">보기</div>

        <button className="menu-button" onClick={() => onToggleLeft?.()}>
          {leftCollapsed ? "사이드바 열기" : "사이드바 숨기기"}
        </button>

        <label className="menu-row">
          <span>세션 메타</span>
          <input
            type="checkbox"
            checked={Boolean(showSessionMeta)}
            onChange={() => onToggleSessionMeta?.(!showSessionMeta)}
          />
        </label>

        <label className="menu-row">
          <span>세션 필터</span>
          <select
            value={statusFilter}
            onChange={(e) => onChangeStatusFilter?.(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="planning">계획</option>
            <option value="running">실행</option>
            <option value="success">완료</option>
            <option value="failed">실패</option>
          </select>
        </label>
      </div>

      <div className="menu-section">
        <div className="menu-title">패널</div>
        <button className="menu-button" onClick={() => onOpenDrawerTab?.("steps")}>
          실행 단계 보기
        </button>
        <button className="menu-button" onClick={() => onOpenDrawerTab?.("approval")}>
          승인 ({approvalsNeededCount})
        </button>
        <button
          className="menu-button"
          onClick={() => onOpenDrawerTab?.("debug")}
          disabled={!debugEnabled}
          title={debugEnabled ? "" : "Debug를 켜야 볼 수 있습니다."}
        >
          Debug 보기
        </button>
      </div>
    </div>
  );
}

