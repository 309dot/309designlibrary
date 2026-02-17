import React, { useMemo, useState } from "react";

const phaseLabel = (phase) => {
  if (phase === "planning") return "Plan";
  if (phase === "acting") return "Act";
  if (phase === "verifying") return "Verify";
  if (phase === "evaluating") return "Evaluate";
  if (phase === "replanning") return "Replan";
  if (phase === "needs_approval") return "권한 필요";
  if (phase === "needs_user") return "추가 정보 필요";
  if (phase === "done") return "Done";
  return "Idle";
};

function Disclosure({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="disc">
      <button className="disc-head" onClick={() => setOpen((v) => !v)}>
        <span className="disc-caret">{open ? "▾" : "▸"}</span>
        <span className="disc-title">{title}</span>
      </button>
      {open ? <div className="disc-body">{children}</div> : null}
    </div>
  );
}

const typeBadge = (type) => {
  const t = String(type ?? "").toLowerCase();
  if (t === "plan") return "PLAN";
  if (t === "act") return "ACT";
  if (t === "verify") return "VERIFY";
  if (t === "evaluate") return "EVAL";
  if (t === "replan") return "REPLAN";
  if (t === "done") return "DONE";
  return t ? t.toUpperCase() : "UNKNOWN";
};

const resultBadge = (result) => {
  if (result === "success") return "success";
  if (result === "failed") return "failed";
  if (result === "cancelled") return "cancelled";
  if (result === "skipped") return "skipped";
  return "unknown";
};

export default function ExecutionSteps({ session, actSummary, actLogPreview, logs, changedFiles, diffText }) {
  const phase = session?.pipeline?.phase ?? "idle";
  const status = session?.status ?? "idle";
  const request = session?.request ?? "";
  const plan = session?.plan ?? "";
  const lastAnswer = session?.lastAnswer ?? "";
  const permission = session?.permission ?? "basic";
  const requiredApprovals = session?.requiredApprovals ?? {};
  const approvals = session?.approvals ?? {};
  const figmaMcp = session?.pipeline?.mcpContext?.figma ?? null;
  const goal = session?.pipeline?.goal ?? {};
  const loop = session?.pipeline?.loop ?? {};
  const nextAction = session?.pipeline?.nextAction ?? {};
  const history = Array.isArray(session?.history) ? session.history : [];

  const changedLabel = useMemo(() => {
    if (!changedFiles?.length) return "없음";
    return `${changedFiles.length}개`;
  }, [changedFiles]);

  const approvalsLabel = useMemo(() => {
    const needed = Object.entries(requiredApprovals)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k);
    if (!needed.length) return "없음";
    const approved = needed.filter((k) => Boolean(approvals?.[k]));
    return `${approved.length}/${needed.length} (${needed.join(", ")})`;
  }, [requiredApprovals, approvals]);

  return (
    <div className="steps steps-lite">
      <div className="steps-summary">
        <div className="steps-kv">
          <div className="k">Loop</div>
          <div className="v">
            <span className="mono">{loop.step ?? "plan"}</span> ·{" "}
            <span className="mono">
              attempt {loop.attempt ?? 0}/{loop.maxAttempts ?? 3}
            </span>
          </div>
        </div>
        <div className="steps-kv">
          <div className="k">Next</div>
          <div className="v">
            <span className="mono">{nextAction.type ?? "auto"}</span>
            {nextAction.description ? <span className="muted"> · {nextAction.description}</span> : null}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="steps-summary">
        <div className="steps-kv">
          <div className="k">상태</div>
          <div className="v">
            <span className="mono">{status}</span> · <span className="mono">{phaseLabel(phase)}</span>
          </div>
        </div>
        <div className="steps-kv">
          <div className="k">권한</div>
          <div className="v">
            <span className="mono">{permission}</span>
          </div>
        </div>
        <div className="steps-kv">
          <div className="k">승인</div>
          <div className="v">
            <span className="mono">{approvalsLabel}</span>
          </div>
        </div>
        <div className="steps-kv">
          <div className="k">변경</div>
          <div className="v">
            <span className="mono">{changedLabel}</span>
          </div>
        </div>
      </div>

      <div className="divider" />

      <Disclosure title="Goal" defaultOpen={true}>
        <div className="prewrap">
          <div className="clamp">{goal.statement || "(없음)"}</div>
          {Array.isArray(goal.success_criteria) && goal.success_criteria.length ? (
            <div className="muted" style={{ marginTop: 8 }}>
              성공 기준:
              <div className="file-list" style={{ marginTop: 6 }}>
                {goal.success_criteria.slice(0, 6).map((c, i) => (
                  <div key={i} className="mono file-item">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {Array.isArray(goal.artifacts) && goal.artifacts.length ? (
            <div className="muted" style={{ marginTop: 8 }}>
              아티팩트:
              <div className="file-list" style={{ marginTop: 6 }}>
                {goal.artifacts.slice(0, 20).map((a) => (
                  <div key={a} className="mono file-item">
                    {a}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Disclosure>

      <div className="divider" />

      <Disclosure title={`History (${history.length})`} defaultOpen={true}>
        {history.length ? (
          <div className="file-list">
            {[...history].reverse().map((h) => {
              const exec = h.execution_summary ?? {};
              const wc = exec.worldChange ?? {};
              const result = exec.result ?? h.status ?? "unknown";
              return (
                <div key={h.id ?? `${h.type}-${h.at}`} className="thread-row" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="thread-main" style={{ gap: 6 }}>
                    <div className="thread-title" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="mono" style={{ opacity: 0.8 }}>
                        {typeBadge(h.type)}
                      </span>
                      <span className="mono" style={{ opacity: 0.6 }}>
                        {resultBadge(result)}
                      </span>
                      <span className="muted" style={{ marginLeft: "auto" }}>
                        {h.at ? new Date(h.at).toLocaleString() : ""}
                      </span>
                    </div>
                    {h.summary ? <div className="clamp">{h.summary}</div> : null}

                    {h.evaluation ? (
                      <div className="muted">
                        achieved: <span className="mono">{h.evaluation.achieved ?? "?"}</span> · conf:{" "}
                        <span className="mono">{h.evaluation.confidence ?? "?"}</span>
                        {Array.isArray(h.evaluation.missing) && h.evaluation.missing.length ? (
                          <div style={{ marginTop: 6 }}>
                            missing:
                            <div className="file-list" style={{ marginTop: 6 }}>
                              {h.evaluation.missing.slice(0, 6).map((m, i) => (
                                <div key={i} className="mono file-item">
                                  {m}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="muted">
                      files:{" "}
                      <span className="mono">
                        +{(wc.filesCreated ?? []).length} ~{(wc.filesModified ?? []).length} -{(wc.filesDeleted ?? []).length}
                      </span>
                      {Array.isArray(exec.testsExecuted) && exec.testsExecuted.length ? (
                        <span>
                          {" "}
                          · tests: <span className="mono">{exec.testsExecuted.slice(0, 2).join(", ")}</span>
                        </span>
                      ) : null}
                    </div>

                    <Disclosure title="execution_summary">
                      <pre className="mono prewrap codeblock">{JSON.stringify(exec, null, 2)}</pre>
                    </Disclosure>
                    {h.verifyDecision ? (
                      <Disclosure title="verifyDecision">
                        <pre className="mono prewrap codeblock">{JSON.stringify(h.verifyDecision, null, 2)}</pre>
                      </Disclosure>
                    ) : null}
                    {h.detail ? (
                      <Disclosure title="detail">
                        <pre className="mono prewrap codeblock">{h.detail}</pre>
                      </Disclosure>
                    ) : null}
                    <div className="divider" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="muted">아직 기록이 없습니다.</div>
        )}
      </Disclosure>

      <div className="divider" />

      <Disclosure title="MCP (Figma)">
        {figmaMcp ? (
          <div className="prewrap">
            <div>
              상태: <span className="mono">{figmaMcp.ok ? "ok" : "fail"}</span>
            </div>
            {figmaMcp.ref?.url ? (
              <div className="clamp">
                url: <span className="mono">{figmaMcp.ref.url}</span>
              </div>
            ) : null}
            {figmaMcp.ok ? (
              <div className="muted">필요한 디자인 컨텍스트를 세션에 주입했습니다.</div>
            ) : (
              <div className="muted">
                Figma Desktop에서 해당 파일을 열고, 프레임/컴포넌트를 하나 선택한 뒤 다시 시도하세요.
              </div>
            )}
          </div>
        ) : (
          <div className="muted">이 세션에서 MCP 컨텍스트가 없습니다.</div>
        )}
      </Disclosure>

      <div className="divider" />

      <Disclosure title="요청" defaultOpen={true}>
        <div className="prewrap clamp">{request || "(없음)"}</div>
      </Disclosure>

      <div className="divider" />

      <Disclosure title="최신 답변" defaultOpen={true}>
        <div className="prewrap clamp">{lastAnswer || "(아직 없음)"}</div>
      </Disclosure>

      <div className="divider" />

      <Disclosure title="계획(Plan)">
        <div className="prewrap">{plan || "(없음)"}</div>
      </Disclosure>

      <div className="divider" />

      <Disclosure title="실행 로그(요약)">
        <pre className="mono prewrap codeblock">{actSummary || ""}</pre>
      </Disclosure>

      <div className="divider" />

      <Disclosure title="실행 로그(상세)">
        <pre className="mono prewrap codeblock">{actLogPreview || ""}</pre>
      </Disclosure>

      <div className="divider" />

      <Disclosure title="검증/기타 로그">
        <pre className="mono prewrap codeblock">{logs || ""}</pre>
      </Disclosure>

      <div className="divider" />

      <Disclosure title={`변경 파일 (${changedLabel})`}>
        {changedFiles?.length ? (
          <div className="file-list">
            {changedFiles.map((f) => (
              <div key={f} className="mono file-item">
                {f}
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">변경된 파일이 감지되지 않았습니다.</div>
        )}
      </Disclosure>

      <div className="divider" />

      <Disclosure title="Diff">
        <pre className="mono prewrap codeblock">{diffText || "(diff 없음)"}</pre>
      </Disclosure>
    </div>
  );
}
