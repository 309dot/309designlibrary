import React from "react";

export default function PlanEditor({
  request,
  onRequestChange,
  plan,
  onPlanChange,
  onGeneratePlan,
  planStatus,
  notice,
  disabled
}) {
  return (
    <div className="plan-editor">
      <div className="section-title">요청</div>
      <textarea
        value={request}
        onChange={(event) => onRequestChange(event.target.value)}
        placeholder="예: 로그인 버튼 컴포넌트를 추가해줘"
        rows={3}
        disabled={disabled}
      />
      <div className="actions-row">
        <button className="primary" onClick={onGeneratePlan} disabled={disabled || !request.trim()}>
          {planStatus === "running" ? "계획 생성 중" : "Plan 생성"}
        </button>
        {notice && <div className="notice">{notice}</div>}
      </div>
      <div className="section-title">PLAN</div>
      <textarea
        value={plan}
        onChange={(event) => onPlanChange(event.target.value)}
        placeholder="Plan이 자동으로 생성됩니다. 수정할 수 있습니다."
        rows={8}
        disabled={disabled}
      />
    </div>
  );
}
