import React from "react";

export default function ActPanel({ status, summary, logs }) {
  return (
    <div className="main-panel">
      <div className="panel-card">
        <div className="panel-card-header">
          <div className="panel-card-title">ACT</div>
          {status === "running" ? (
            <span className="pill running">실행 중</span>
          ) : null}
        </div>
        <pre className="assistant-log">{summary || "아직 실행 로그가 없습니다."}</pre>
      </div>

      <div className="panel-card subtle">
        <div className="panel-card-title">최근 로그</div>
        <pre className="assistant-log tight">{logs || "로그가 없습니다."}</pre>
      </div>
    </div>
  );
}

