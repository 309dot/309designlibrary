import React, { useMemo } from "react";

const extractVerifyLines = (logText) => {
  if (!logText) return "";
  const lines = logText.split("\n");
  const picked = lines.filter((line) => /verify|test|테스트|검증/i.test(line));
  return picked.join("\n");
};

export default function VerifyPanel({ logs }) {
  const verifyText = useMemo(() => extractVerifyLines(logs), [logs]);
  return (
    <div className="main-panel">
      <div className="panel-card">
        <div className="panel-card-title">VERIFY</div>
        <pre className="assistant-log">
          {verifyText || "검증/테스트 관련 로그가 아직 없습니다."}
        </pre>
      </div>
    </div>
  );
}

