import React from "react";
import ModeSwitcher from "../models/ModeSwitcher.jsx";
import ModelPresetPicker from "../models/ModelPresetPicker.jsx";

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

export default function RunStatusBar({
  status,
  runningSince,
  mode,
  onChangeMode,
  models,
  selectedModel,
  onChangeModel,
  approvalsNeededCount,
  onOpenApprovals,
  disabled,
  leftCollapsed,
  onToggleLeft
}) {
  const elapsedSec = runningSince
    ? Math.floor((Date.now() - runningSince) / 1000)
    : null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="ghost icon-button"
          onClick={onToggleLeft}
          title={leftCollapsed ? "세션 패널 열기" : "세션 패널 숨기기"}
          aria-pressed={leftCollapsed ? "true" : "false"}
        >
          {leftCollapsed ? "▸" : "◂"}
        </button>
        <div className="topbar-title">OpenClaw</div>
        <span className={`status status-strong ${statusClass(status)}`}>
          {statusLabels[status] ?? "대기"}
        </span>
        {elapsedSec !== null ? (
          <span className="mono small">{elapsedSec}s</span>
        ) : null}
      </div>

      <div className="topbar-right">
        <button className="ghost approvals-button" onClick={onOpenApprovals}>
          승인 필요 ({approvalsNeededCount})
        </button>
        <ModeSwitcher value={mode} onChange={onChangeMode} disabled={disabled} />
        <ModelPresetPicker
          models={models}
          selectedModel={selectedModel}
          onModelChange={onChangeModel}
          disabled={disabled}
        />
      </div>
    </header>
  );
}
