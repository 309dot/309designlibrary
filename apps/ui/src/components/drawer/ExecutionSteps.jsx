import React, { useState } from "react";
import PlanPanel from "../main/panels/PlanPanel.jsx";
import ActPanel from "../main/panels/ActPanel.jsx";
import VerifyPanel from "../main/panels/VerifyPanel.jsx";
import DonePanel from "../main/panels/DonePanel.jsx";

const tabs = [
  { key: "plan", label: "Plan" },
  { key: "act", label: "Act" },
  { key: "verify", label: "Verify" },
  { key: "done", label: "Done" }
];

export default function ExecutionSteps({
  request,
  plan,
  planExpanded,
  onTogglePlanExpanded,
  onChangePlan,
  status,
  phase,
  pendingContinue,
  onContinue,
  actSummary,
  actLogPreview,
  logs,
  changedFiles,
  diffText
}) {
  const [active, setActive] = useState("plan");

  return (
    <div className="steps">
      <div className="steps-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`steps-tab ${active === t.key ? "active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "plan" && (
        <div>
          <PlanPanel
            request={request}
            plan={plan}
            expanded={planExpanded}
            onToggleExpanded={onTogglePlanExpanded}
            onChangePlan={onChangePlan}
          />

          {pendingContinue ? (
            <div className="steps-continue">
              <div className="notice">
                {phase === "needs_approval"
                  ? "승인이 필요합니다. 승인 후 계속 실행할 수 있습니다."
                  : "Plan 모드가 켜져 있어서 Plan만 완료되었습니다. 나머지 단계를 실행할 수 있습니다."}
              </div>
              <button className="primary" onClick={onContinue}>
                나머지 실행 (Act + Verify)
              </button>
            </div>
          ) : null}
        </div>
      )}
      {active === "act" && (
        <ActPanel status={status} summary={actSummary} logs={actLogPreview} />
      )}
      {active === "verify" && <VerifyPanel logs={logs} />}
      {active === "done" && (
        <DonePanel
          status={status}
          summary={actSummary}
          changedFiles={changedFiles}
          diffText={diffText}
        />
      )}
    </div>
  );
}
