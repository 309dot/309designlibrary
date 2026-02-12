import React from "react";

const previewLines = (text, lines = 6) => {
  const list = String(text || "")
    .split("\n")
    .map((line) => line.trimEnd());
  return list.slice(0, lines).join("\n");
};

export default function PlanPanel({
  request,
  plan,
  expanded,
  onToggleExpanded,
  onChangePlan
}) {
  const hasPlan = Boolean(plan && plan.trim());
  return (
    <div className="main-panel">
      <div className="panel-card">
        <div className="panel-card-header">
          <div className="panel-card-title">PLAN</div>
          <button className="ghost" onClick={onToggleExpanded}>
            {expanded ? "접기" : "펼치기"}
          </button>
        </div>

        {!hasPlan && (
          <div className="empty">Plan이 아직 없습니다. 아래 입력창에서 Plan을 생성하세요.</div>
        )}

        {hasPlan && !expanded && (
          <pre className="assistant-log preview">{previewLines(plan, 8)}</pre>
        )}

        {hasPlan && expanded && (
          <textarea
            value={plan}
            onChange={(event) => onChangePlan(event.target.value)}
            rows={14}
            placeholder="Plan을 편집할 수 있습니다."
          />
        )}
      </div>

      <div className="panel-card subtle">
        <div className="panel-card-title">요청(참고)</div>
        <div className="mono small">{request || "-"}</div>
      </div>
    </div>
  );
}

