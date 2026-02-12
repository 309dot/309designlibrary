import React, { useEffect, useMemo, useRef, useState } from "react";
import AppShell from "./components/layout/AppShell.jsx";
import SessionList from "./components/sessions/SessionList.jsx";
import Inspector from "./components/inspector/Inspector.jsx";
import ApprovalGate from "./components/approvals/ApprovalGate.jsx";
import PromptComposer from "./components/composer/PromptComposer.jsx";
import TopBarMinimal from "./components/topbar/TopBarMinimal.jsx";
import ChatThread from "./components/chat/ChatThread.jsx";
import RightDrawerTabs from "./components/drawer/RightDrawerTabs.jsx";
import ExecutionSteps from "./components/drawer/ExecutionSteps.jsx";
import ApproveModal from "./components/modals/ApproveModal.jsx";

const defaultApprovals = {
  mail: false,
  deploy: false,
  merge: false,
  gitPush: false,
  prCreate: false
};

const approvalKeywords = {
  mail: /메일|email|gmail|calendar|캘린더|보내|send/i,
  deploy: /배포|deploy|release|prod|production/i,
  merge: /머지|merge/i,
  gitPush: /git\s*push|push origin/i,
  prCreate: /\bPR\b|pull request|draft pr/i
};

const summarizeLog = (logText, lineCount = 6) => {
  if (!logText) return "아직 로그가 없습니다.";
  const lines = logText
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.length);
  if (!lines.length) return "아직 로그가 없습니다.";
  return lines.slice(-lineCount).join("\n");
};

const filterLogs = (logText, filters) => {
  if (!logText) return "";
  const activeFilters = Object.entries(filters).filter(([, value]) => value);
  if (!activeFilters.length) return logText;
  const lines = logText.split("\n");
  return lines
    .filter((line) => {
      return activeFilters.some(([key]) => {
        if (key === "error") return /error|failed|exception|err/i.test(line);
        if (key === "warn") return /warn|warning/i.test(line);
        if (key === "tool") return /tool start|tool end|tool=/i.test(line);
        if (key === "agent") return /agent|payloads|plan|actions|verify/i.test(line);
        return false;
      });
    })
    .join("\n");
};

const extractTerminal = (logText) => {
  if (!logText) return "";
  const lines = logText.split("\n");
  const picked = lines.filter((line) =>
    /stdout|stderr|\$|\bcommand\b|실행|exec/i.test(line)
  );
  return picked.length ? picked.join("\n") : "";
};

const resolveParentPath = (currentPath) => {
  if (!currentPath || currentPath === "/workspace") return "/workspace";
  const trimmed = currentPath.replace(/\/$/, "");
  const parent = trimmed.split("/").slice(0, -1).join("/");
  return parent || "/workspace";
};

export default function App() {
  const [config, setConfig] = useState(null);
  const [models, setModels] = useState([]);
  const [presets, setPresets] = useState({});
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [draft, setDraft] = useState("");
  const [plan, setPlan] = useState("");
  const [planEdited, setPlanEdited] = useState(false);
  const [mode, setMode] = useState("assistant");
  const [selectedModel, setSelectedModel] = useState("");
  const [approvals, setApprovals] = useState(defaultApprovals);
  const [requiredApprovals, setRequiredApprovals] = useState(defaultApprovals);
  const [notice, setNotice] = useState("");
  const [inspectorTab, setInspectorTab] = useState("tools");
  const [toolEvents, setToolEvents] = useState([]);
  const [log, setLog] = useState("");
  const [lastLogAt, setLastLogAt] = useState(null);
  const [runningSince, setRunningSince] = useState(null);
  const [diff, setDiff] = useState("");
  const [changedFiles, setChangedFiles] = useState([]);
  const [fsPath, setFsPath] = useState("/workspace");
  const [fsEntries, setFsEntries] = useState([]);
  const [filePreview, setFilePreview] = useState("");
  const [logFilter, setLogFilter] = useState({
    error: false,
    warn: false,
    tool: false,
    agent: false
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [runSummary, setRunSummary] = useState(null);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("steps"); // steps|approval|debug|settings
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [planMode, setPlanMode] = useState(false);
  const [showSessionMeta, setShowSessionMeta] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  const lastSessionIdRef = useRef(null);

  const activeRun = useMemo(() => {
    const runs = sessionDetail?.runs ?? [];
    if (!runs.length) return null;
    const activeId = sessionDetail?.pipeline?.activeRunId ?? null;
    if (activeId) {
      const found = runs.find((r) => r.id === activeId);
      if (found) return found;
    }
    return [...runs].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    )[0];
  }, [sessionDetail]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setConfig(data);
        setModels(data.models ?? []);
        setPresets(data.presets ?? {});
        if (!selectedModel && data.models?.length) {
          setSelectedModel(data.models[0].id);
        }
      } catch {
        // ignore
      }
    };

    loadConfig();
  }, [selectedModel]);

  useEffect(() => {
    let mounted = true;
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        if (!mounted) return;
        setSessions(data);
        if (!activeSessionId && data.length) {
          setActiveSessionId(data[0].id);
        }
      } catch {
        // ignore
      }
    };
    fetchSessions();
    const timer = setInterval(fetchSessions, 2000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [activeSessionId]);

  useEffect(() => {
    if (!activeSessionId) return;
    let mounted = true;
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${activeSessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setSessionDetail(data);
      } catch {
        // ignore
      }
    };
    fetchSession();
    const timer = setInterval(fetchSession, 2000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [activeSessionId]);

  useEffect(() => {
    if (!sessionDetail) return;
    if (lastSessionIdRef.current !== sessionDetail.id) {
      setDraft("");
      setPlan(sessionDetail.plan || "");
      setPlanEdited(false);
      setMode(sessionDetail.modelPreset || "assistant");
      setSelectedModel(sessionDetail.modelId || selectedModel);
      setApprovals(sessionDetail.approvals || defaultApprovals);
      setPlanExpanded(false);
      setApprovalModalOpen(false);
      lastSessionIdRef.current = sessionDetail.id;
      return;
    }
    if (!planEdited) {
      setPlan(sessionDetail.plan || "");
    }
  }, [sessionDetail, planEdited, selectedModel]);

  useEffect(() => {
    if (debugEnabled) return;
    if (activeDrawerTab === "debug") setActiveDrawerTab("steps");
  }, [debugEnabled, activeDrawerTab]);

  useEffect(() => {
    if (sessionDetail?.pipeline?.phase !== "needs_approval") return;
    if (approvalsNeededCount <= 0) return;
    setApprovalModalOpen(true);
  }, [sessionDetail?.pipeline?.phase, approvalsNeededCount]);

  useEffect(() => {
    if (sessionDetail?.requiredApprovals) {
      setRequiredApprovals({ ...defaultApprovals, ...sessionDetail.requiredApprovals });
      return;
    }
    const base = sessionDetail?.request ?? "";
    const text = `${base}\n${plan}`;
    const nextRequired = { ...defaultApprovals };
    Object.entries(approvalKeywords).forEach(([key, regex]) => {
      nextRequired[key] = regex.test(text);
    });
    setRequiredApprovals(nextRequired);
  }, [sessionDetail?.requiredApprovals, sessionDetail?.request, plan]);

  useEffect(() => {
    if (!activeRun) {
      setLog("");
      setLastLogAt(null);
      setRunningSince(null);
      return;
    }
    setLog("");
    setLastLogAt(null);
    if (activeRun.status === "running") {
      setRunningSince(Date.now());
    }

    const es = new EventSource(`/api/runs/${activeRun.id}/stream`);
    es.addEventListener("log", (event) => {
      const payload = JSON.parse(event.data || "{}");
      if (payload.data) {
        setLog((prev) => prev + payload.data);
        setLastLogAt(Date.now());
      }
    });
    es.addEventListener("done", () => {
      es.close();
    });
    es.onerror = () => {
      es.close();
    };
    return () => {
      es.close();
    };
  }, [activeRun?.id]);

  useEffect(() => {
    if (!activeRun || !debugEnabled) return;
    let cancelled = false;
    const pollTools = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/runs/${activeRun.id}/tools`);
        if (res.ok) {
          const data = await res.json();
          setToolEvents(data?.events ?? []);
        }
      } catch {
        // ignore
      }
      if (!cancelled) {
        setTimeout(pollTools, 2000);
      }
    };
    pollTools();
    return () => {
      cancelled = true;
    };
  }, [activeRun?.id, debugEnabled]);

  useEffect(() => {
    if (!activeRun || activeRun.status === "running") return;
    const loadArtifacts = async () => {
      try {
        const res = await fetch(`/api/runs/${activeRun.id}/artifacts`);
        if (res.ok) {
          const data = await res.json();
          setDiff(data.diff || "");
          setChangedFiles(data.files || []);
        }
      } catch {
        // ignore
      }
    };
    loadArtifacts();
  }, [activeRun?.id, activeRun?.status]);

  useEffect(() => {
    if (!debugEnabled || !activeRun) {
      setRunSummary(null);
      return;
    }
    let cancelled = false;
    const loadSummary = async () => {
      try {
        const res = await fetch(`/api/runs/${activeRun.id}/summary`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setRunSummary(data);
        }
      } catch {
        // ignore
      }
    };
    loadSummary();
    const timer = setInterval(loadSummary, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [activeRun?.id, debugEnabled]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const res = await fetch(`/api/fs/list?path=${encodeURIComponent(fsPath)}`);
        if (!res.ok) return;
        const data = await res.json();
        setFsPath(data.path);
        setFsEntries(data.entries || []);
      } catch {
        // ignore
      }
    };
    if (debugEnabled) loadFiles();
  }, [fsPath, debugEnabled]);

  const filteredLog = useMemo(() => filterLogs(log, logFilter), [log, logFilter]);
  const terminalText = useMemo(() => {
    const extracted = extractTerminal(log);
    return extracted || "터미널 로그가 없습니다.";
  }, [log]);

  const canRunAct = useMemo(() => {
    if (!plan.trim()) return false;
    return Object.entries(requiredApprovals).every(([key, required]) => {
      if (!required) return true;
      return Boolean(approvals[key]);
    });
  }, [requiredApprovals, approvals, plan]);

  const approvalsNeededCount = useMemo(() => {
    return Object.entries(requiredApprovals).reduce((acc, [key, needed]) => {
      if (!needed) return acc;
      return acc + (approvals[key] ? 0 : 1);
    }, 0);
  }, [requiredApprovals, approvals]);

  const disabledControls =
    sessionDetail?.status === "running" || sessionDetail?.status === "planning";

  const handleNewChat = async () => {
    setNotice("");
    try {
      const res = await fetch("/api/chat/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          modelId: selectedModel,
          approvals
        })
      });
      if (!res.ok) {
        setNotice("새 채팅을 만들지 못했습니다.");
        return;
      }
      const data = await res.json();
      setActiveSessionId(data.session.id);
      setPlanEdited(false);
      setDraft("");
      setNotice("");
    } catch {
      setNotice("서버에 연결할 수 없습니다.");
    }
  };

  const sendChat = async ({ planOnly }) => {
    if (disabledControls) return;
    setNotice("");
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionDetail?.id ?? null,
          message: draft,
          mode,
          modelId: selectedModel,
          planMode: Boolean(planOnly),
          approvals
        })
      });
      if (!res.ok) {
        setNotice(
          res.status === 409 ? "이미 실행 중입니다." : "요청을 시작하지 못했습니다."
        );
        return;
      }
      const data = await res.json();
      if (data?.session?.id) setActiveSessionId(data.session.id);
      setPlanEdited(false);
      setDraft("");
      setNotice(data.rewritten ? "경로가 workspace 기준으로 자동 변환되었습니다." : "");
      openDrawer("steps");
    } catch {
      setNotice("서버에 연결할 수 없습니다.");
    }
  };

  const handleContinue = async () => {
    if (!sessionDetail) return;
    if (disabledControls) return;
    setNotice("");
    try {
      const res = await fetch("/api/chat/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionDetail.id,
          plan,
          modelId: selectedModel,
          approvals
        })
      });
      if (!res.ok) {
        if (res.status === 409) {
          setApprovalModalOpen(true);
          return;
        }
        setNotice("실행을 시작하지 못했습니다.");
        return;
      }
      setNotice("");
      openDrawer("steps");
    } catch {
      setNotice("서버에 연결할 수 없습니다.");
    }
  };

  const handleOpenFile = async (entry) => {
    if (entry.type === "dir") {
      setFsPath(entry.path);
      return;
    }
    try {
      const res = await fetch(`/api/fs/read?path=${encodeURIComponent(entry.path)}`);
      if (!res.ok) return;
      const data = await res.json();
      setFilePreview(data.content || "");
    } catch {
      // ignore
    }
  };

  const handleNavigate = (target) => {
    if (target === "..") {
      setFsPath(resolveParentPath(fsPath));
    } else {
      setFsPath(target);
    }
  };

  const handleLogFilterChange = (key) => {
    setLogFilter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const actSummary = summarizeLog(log, 6);
  const actLogPreview = summarizeLog(log, 80);

  const openDrawer = (tab) => {
    setDrawerOpen(true);
    setActiveDrawerTab(tab);
  };

  const handleSend = async () => {
    if (disabledControls) return;
    if (!draft.trim()) return;
    await sendChat({ planOnly: Boolean(planMode) });
  };

  const handleSendPlan = async () => {
    if (disabledControls) return;
    if (!draft.trim()) return;
    await sendChat({ planOnly: true });
  };

  return (
    <AppShell
      left={
        <SessionList
          sessions={sessions}
          activeId={activeSessionId}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearch={setSearchTerm}
          onFilter={setStatusFilter}
          onSelect={setActiveSessionId}
          debugEnabled={debugEnabled}
          onToggleDebug={() =>
            setDebugEnabled((prev) => {
              const next = !prev;
              if (next) {
                openDrawer("debug");
              } else if (activeDrawerTab === "debug") {
                setActiveDrawerTab("steps");
              }
              return next;
            })
          }
          mode={mode}
          showMeta={showSessionMeta}
        />
      }
      center={
        <div className="main-chat">
          <TopBarMinimal
            title={sessionDetail?.title || "New chat"}
            status={sessionDetail?.status || "idle"}
            leftCollapsed={leftCollapsed}
            onToggleLeft={() => setLeftCollapsed((prev) => !prev)}
            onNewChat={handleNewChat}
            approvalsNeededCount={approvalsNeededCount}
            debugEnabled={debugEnabled}
            drawerOpen={drawerOpen}
            onOpenSteps={() => openDrawer("steps")}
            onOpenApproval={() => openDrawer("approval")}
            onOpenDebug={() => {
              if (!debugEnabled) setDebugEnabled(true);
              openDrawer("debug");
            }}
            onOpenSettings={() => openDrawer("settings")}
            onCloseDrawer={() => setDrawerOpen(false)}
          />

          <div className="chat-scroll">
            <ChatThread
              title="OpenClaw"
              status={sessionDetail?.status || "idle"}
              phase={sessionDetail?.pipeline?.phase || "idle"}
              messages={sessionDetail?.messages || []}
              notice={notice}
              onOpenSteps={() => openDrawer("steps")}
            />
          </div>

          <div className="composer-sticky">
            <PromptComposer
              request={draft}
              onChangeRequest={setDraft}
              onSend={handleSend}
              onSendPlan={handleSendPlan}
              mode={mode}
              onChangeMode={(nextMode) => {
                setMode(nextMode);
                if (presets[nextMode]) setSelectedModel(presets[nextMode]);
              }}
              models={models}
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              planMode={planMode}
              onTogglePlanMode={(next) => setPlanMode(Boolean(next))}
              debugEnabled={debugEnabled}
              onToggleDebug={(next) => setDebugEnabled(Boolean(next))}
              disabled={disabledControls}
            />
          </div>

          <ApproveModal
            open={approvalModalOpen}
            pendingCount={approvalsNeededCount}
            onCancel={() => setApprovalModalOpen(false)}
            onApprove={() => {
              setApprovalModalOpen(false);
              openDrawer("approval");
            }}
          />
        </div>
      }
      right={
        <div className="right-drawer">
          <div className="right-drawer-header">
            <div className="right-title">패널</div>
            <button className="ghost tiny" onClick={() => setDrawerOpen(false)}>
              닫기
            </button>
          </div>

          <RightDrawerTabs
            active={activeDrawerTab}
            onChange={setActiveDrawerTab}
            debugEnabled={debugEnabled}
          />

          <div className="right-drawer-body">
            {activeDrawerTab === "steps" && (
              <ExecutionSteps
                request={sessionDetail?.request || ""}
                plan={plan}
                planExpanded={planExpanded}
                onTogglePlanExpanded={() => setPlanExpanded((prev) => !prev)}
                onChangePlan={(value) => {
                  setPlanEdited(true);
                  setPlan(value);
                }}
                status={sessionDetail?.status}
                phase={sessionDetail?.pipeline?.phase || "idle"}
                pendingContinue={Boolean(sessionDetail?.pipeline?.pendingContinue)}
                onContinue={handleContinue}
                actSummary={actSummary}
                actLogPreview={actLogPreview}
                logs={log}
                changedFiles={changedFiles}
                diffText={diff}
              />
            )}

            {activeDrawerTab === "approval" && (
              <ApprovalGate
                approvals={approvals}
                required={requiredApprovals}
                onToggle={(key) =>
                  setApprovals((prev) => ({ ...prev, [key]: !prev[key] }))
                }
              />
            )}

            {activeDrawerTab === "debug" && debugEnabled ? (
              <Inspector
                activeTab={inspectorTab}
                onTabChange={setInspectorTab}
                toolEvents={toolEvents}
                terminalText={terminalText}
                diffText={diff}
                files={changedFiles}
                fsPath={fsPath}
                fsEntries={fsEntries}
                filePreview={filePreview}
                onNavigate={handleNavigate}
                onOpenFile={handleOpenFile}
                logs={filteredLog}
                logFilter={logFilter}
                onLogFilterChange={handleLogFilterChange}
                advancedOpen={advancedOpen}
                onAdvancedToggle={() => setAdvancedOpen((prev) => !prev)}
                config={config}
                summary={runSummary}
              />
            ) : activeDrawerTab === "debug" ? (
              <div className="empty">Debug가 꺼져 있습니다. 메뉴에서 켜세요.</div>
            ) : null}

            {activeDrawerTab === "settings" && (
              <div className="settings-panel">
                <div className="panel-title">Settings</div>
                <div className="info-grid">
                  <div className="meta-label">Plan 모드</div>
                  <div>
                    <input
                      type="checkbox"
                      checked={Boolean(planMode)}
                      onChange={() => setPlanMode((prev) => !prev)}
                    />
                  </div>
                  <div className="meta-label">Debug</div>
                  <div>
                    <input
                      type="checkbox"
                      checked={Boolean(debugEnabled)}
                      onChange={() => setDebugEnabled((prev) => !prev)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
      mode={mode}
      leftCollapsed={leftCollapsed}
      drawerOpen={drawerOpen}
    />
  );
}
