import React from "react";

export default function ChatPane({ request, plan, actSummary }) {
  return (
    <div className="chat-pane">
      <div className="message user">
        <div className="message-meta">You</div>
        <div className="bubble">{request || "요청을 입력해주세요."}</div>
      </div>
      <div className="message assistant">
        <div className="message-meta">Plan</div>
        <div className="bubble">
          <pre className="assistant-log">{plan || "Plan이 아직 없습니다."}</pre>
        </div>
      </div>
      <div className="message assistant">
        <div className="message-meta">Act</div>
        <div className="bubble">
          <pre className="assistant-log">{actSummary || "아직 실행 로그가 없습니다."}</pre>
        </div>
      </div>
    </div>
  );
}
