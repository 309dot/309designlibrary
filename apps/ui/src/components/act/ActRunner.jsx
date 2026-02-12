import React from "react";

export default function ActRunner({
  canRun,
  running,
  onRun,
  summary
}) {
  return (
    <div className="act-runner">
      <div className="section-title">ACT</div>
      <div className="act-summary">
        {summary || "아직 실행 로그가 없습니다."}
      </div>
      <div className="actions-row">
        <button className="primary" onClick={onRun} disabled={!canRun || running}>
          {running ? "실행 중" : "Act 실행"}
        </button>
        {!canRun && (
          <span className="hint">승인 게이트를 확인해야 합니다.</span>
        )}
      </div>
    </div>
  );
}
