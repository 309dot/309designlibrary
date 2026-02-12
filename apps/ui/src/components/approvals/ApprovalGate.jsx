import React from "react";

const items = [
  { key: "mail", label: "메일/캘린더 발송" },
  { key: "deploy", label: "배포" },
  { key: "merge", label: "머지" },
  { key: "gitPush", label: "git push" },
  { key: "prCreate", label: "PR 생성" }
];

export default function ApprovalGate({ approvals, required, onToggle }) {
  return (
    <div className="approval-gate">
      <div className="approval-title">승인 게이트</div>
      <div className="approval-help">
        승인 게이트는 에이전트가 <b>위험한 외부/파괴적 작업</b>(메일/캘린더 발송, 배포, 머지,
        git push, PR 생성)을 자동으로 실행하지 못하도록 막는 안전장치입니다. 필요한 항목만
        체크해서 허용하세요.
      </div>
      <div className="approval-list">
        {items.map((item) => {
          const needed = required?.[item.key];
          return (
            <label
              key={item.key}
              className={`approval-item ${needed ? "required" : ""}`}
            >
              <input
                type="checkbox"
                checked={Boolean(approvals?.[item.key])}
                onChange={() => onToggle(item.key)}
              />
              <span>{item.label}</span>
              {needed && <span className="badge">필수</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
