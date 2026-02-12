import React from "react";

export default function DonePanel({ status, summary, changedFiles, diffText }) {
  const ok = status === "success";
  return (
    <div className="main-panel">
      <div className="panel-card">
        <div className="panel-card-header">
          <div className="panel-card-title">DONE</div>
          <span className={`pill ${ok ? "success" : status === "failed" ? "failed" : ""}`}>
            {ok ? "완료" : status === "failed" ? "실패" : "대기"}
          </span>
        </div>
        <pre className="assistant-log">{summary || "요약이 없습니다."}</pre>
      </div>

      <div className="panel-card">
        <div className="panel-card-title">변경 파일</div>
        {changedFiles?.length ? (
          <ul className="diff-files">
            {changedFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <div className="empty">변경된 파일이 없습니다.</div>
        )}
      </div>

      <div className="panel-card">
        <div className="panel-card-title">Diff</div>
        <pre className="assistant-log">{diffText || "diff가 없습니다."}</pre>
      </div>
    </div>
  );
}

