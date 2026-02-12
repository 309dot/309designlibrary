import React from "react";

export default function ConversationPanel({ request, status, summary }) {
  return (
    <div className="main-panel">
      <div className="conversation-block">
        <div className="message user">
          <div className="message-meta">You</div>
          <div className="bubble">{request || "요청을 입력해주세요."}</div>
        </div>

        <div className="message assistant">
          <div className="message-meta">OpenClaw</div>
          <div className="bubble">
            <pre className="assistant-log">
              {summary || (status === "running" ? "실행 중입니다." : "아직 결과가 없습니다.")}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

