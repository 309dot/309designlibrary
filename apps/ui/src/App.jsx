import React, { useEffect, useMemo, useRef, useState } from "react";

const statusLabels = {
  running: "실행 중",
  success: "완료",
  failed: "실패"
};

const statusClass = (status) => {
  if (status === "running") return "running";
  if (status === "success") return "success";
  if (status === "failed") return "failed";
  return "idle";
};

const formatTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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

export default function App() {
  const [runs, setRuns] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [log, setLog] = useState("");
  const [notice, setNotice] = useState("");
  const [inspectorTab, setInspectorTab] = useState("log");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chatLogMode, setChatLogMode] = useState("summary");
  const [toneMode, setToneMode] = useState("friendly");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [runningSince, setRunningSince] = useState(null);
  const [lastLogAt, setLastLogAt] = useState(null);
  const [toolEvents, setToolEvents] = useState([]);
  const logOffsetRef = useRef(0);

  const activeRun = useMemo(
    () => runs.find((run) => run.id === activeId) || runs[0] || null,
    [runs, activeId]
  );

  useEffect(() => {
    let mounted = true;
    const fetchRuns = async () => {
      try {
        const res = await fetch("/api/runs");
        const data = await res.json();
        if (!mounted) return;
        setRuns(data);
        if (!activeId && data.length) {
          setActiveId(data[0].id);
        }
      } catch {
        // ignore
      }
    };

    fetchRuns();
    const timer = setInterval(fetchRuns, 2000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [activeId]);

  useEffect(() => {
    let mounted = true;
    const loadModels = async () => {
      try {
        const res = await fetch("/api/models");
        const data = await res.json();
        if (!mounted) return;
        const list = data?.models ?? [];
        setModels(list);
        if (!selectedModel && list.length) {
          setSelectedModel(list[0].id);
        }
      } catch {
        // ignore
      }
    };

    loadModels();
    return () => {
      mounted = false;
    };
  }, [selectedModel]);

  useEffect(() => {
    if (!activeRun) {
      setLog("");
      logOffsetRef.current = 0;
      setRunningSince(null);
      setLastLogAt(null);
      setToolEvents([]);
      return;
    }
    setLog("");
    logOffsetRef.current = 0;
    if (!runningSince && activeRun.status === "running") {
      setRunningSince(Date.now());
    }

    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(
          `/api/runs/${activeRun.id}/log?offset=${logOffsetRef.current}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data) {
          setLog((prev) => prev + data.data);
          setLastLogAt(Date.now());
        }
        logOffsetRef.current = data?.nextOffset ?? logOffsetRef.current;
      } catch {
        // ignore
      }
      if (!cancelled) {
        setTimeout(poll, 1000);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [activeRun?.id]);

  useEffect(() => {
    if (!activeRun) return;
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
  }, [activeRun?.id]);

  const handleRun = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const finalPrompt = buildPrompt(trimmed);
    setNotice("");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, modelId: selectedModel })
      });
      if (res.status === 409) {
        setNotice("이미 실행 중인 작업이 있습니다.");
        return;
      }
      if (!res.ok) {
        setNotice("실행을 시작하지 못했습니다.");
        return;
      }
      const data = await res.json();
      setPrompt("");
      setActiveId(data.id);
      setRunningSince(Date.now());
      setNotice("실행을 시작했습니다.");
    } catch {
      setNotice("서버에 연결할 수 없습니다.");
    }
  };

  const running = Boolean(activeRun && activeRun.status === "running");
  const logSummary = summarizeLog(log, 7);
  const chatLog =
    chatLogMode === "full"
      ? log.trim() || "로그가 아직 없습니다."
      : logSummary;
  const elapsedSec = runningSince ? Math.floor((Date.now() - runningSince) / 1000) : 0;
  const lastLogSec = lastLogAt ? Math.floor((Date.now() - lastLogAt) / 1000) : null;

  const filteredRuns = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return runs.filter((run) => {
      const statusMatch =
        statusFilter === "all" ? true : run.status === statusFilter;
      if (!statusMatch) return false;
      if (!query) return true;
      const promptText = (run.prompt || "").toLowerCase();
      return run.id?.toLowerCase().includes(query) || promptText.includes(query);
    });
  }, [runs, searchTerm, statusFilter]);

  const templates = [
    {
      label: "작업 1건 처리",
      text: "항상 한국어로 설명해줘.\n/workspace/tasks/inbox에 있는 작업을 1건 처리해줘."
    },
    {
      label: "메일 요약",
      text: "항상 한국어로 설명해줘.\n/Users/a309/workspace/.openclaw/bin/run-email-summary.sh 를 실행해줘."
    },
    {
      label: "일정 제안",
      text: "항상 한국어로 설명해줘.\n/Users/a309/workspace/.openclaw/bin/run-calendar-suggest.sh 를 실행해줘."
    }
  ];

  const buildPrompt = (rawPrompt) => {
    if (toneMode === "plain") return rawPrompt;
    const prefix =
      "항상 한국어로 답해. 필요한 경우 반드시 tool을 사용하고 VERIFY에 stdout/stderr를 포함해.";
    return `${prefix}\n\n요청: ${rawPrompt}`;
  };

  return (
    <div className="app-shell">
      <aside className="panel panel-left">
        <div className="brand">
          <div className="brand-title">OpenClaw Command</div>
          <div className="brand-sub">로컬 에이전트 제어 콘솔</div>
        </div>
        <div className="sidebar-meta">
          <span className="meta-pill">Workspace · wOpenclaw</span>
          <span className="meta-pill">동시 실행 · 1</span>
        </div>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="세션 검색 (ID/프롬프트)"
          />
        </div>
        <div className="filter-row">
          {[
            { key: "all", label: "전체" },
            { key: "running", label: "실행 중" },
            { key: "success", label: "완료" },
            { key: "failed", label: "실패" }
          ].map((item) => (
            <button
              key={item.key}
              className={`filter-button ${
                statusFilter === item.key ? "active" : ""
              }`}
              onClick={() => setStatusFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="panel-section">
          <div className="panel-title">Sessions</div>
          <div className="run-list">
            {filteredRuns.length === 0 && (
              <div className="empty">아직 실행 기록이 없습니다.</div>
            )}
            {filteredRuns.map((run) => (
              <button
                key={run.id}
                className={`run-card ${
                  activeRun?.id === run.id ? "active" : ""
                }`}
                onClick={() => setActiveId(run.id)}
              >
                <div className="run-row">
                  <span className="run-id">{run.id}</span>
                  <span className={`status ${statusClass(run.status)}`}>
                    {statusLabels[run.status] ?? "대기"}
                  </span>
                </div>
                <div className="run-title">
                  {run.prompt?.slice(0, 60) || "-"}
                </div>
                <div className="run-time">{formatTime(run.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="panel panel-center">
        <header className="center-header">
          <div>
            <div className="eyebrow">Conversation</div>
            <h1>프롬프트 콘솔</h1>
            <p>OpenClaw에 명령을 보내고 실행 로그를 확인하세요.</p>
          </div>
          <div className="header-status">
            <div className="model-chip">
              {selectedModel || "모델 없음"}
            </div>
            <div className="status-row">
              <span className={`status ${statusClass(activeRun?.status)}`}>
                {activeRun ? statusLabels[activeRun.status] ?? "대기" : "대기"}
              </span>
              {running && <span className="spinner" aria-label="running" />}
            </div>
            <div className="time">
              {running ? `경과 ${elapsedSec}s` : formatTime(activeRun?.createdAt)}
            </div>
            {lastLogSec !== null && (
              <div className="last-log">마지막 업데이트 {lastLogSec}s 전</div>
            )}
          </div>
        </header>

        <section className="chat-area">
          {!activeRun && (
            <div className="chat-empty">
              아직 실행한 작업이 없습니다. 아래에 명령을 입력하세요.
            </div>
          )}
          {activeRun && (
            <>
              <div className="message user">
                <div className="message-meta">You</div>
                <div className="bubble">{activeRun.prompt || "(프롬프트 없음)"}</div>
              </div>
              <div className="message assistant">
                <div className="message-meta">OpenClaw</div>
                <div className="bubble">
                  <div className="assistant-header">
                    <span className={`status ${statusClass(activeRun.status)}`}>
                      {statusLabels[activeRun.status] ?? "대기"}
                    </span>
                    <span className="assistant-time">
                      {formatTime(activeRun.completedAt || activeRun.createdAt)}
                    </span>
                  </div>
                  <div className="assistant-toggle">
                    <button
                      className={`toggle ${
                        chatLogMode === "summary" ? "active" : ""
                      }`}
                      onClick={() => setChatLogMode("summary")}
                    >
                      요약
                    </button>
                    <button
                      className={`toggle ${
                        chatLogMode === "full" ? "active" : ""
                      }`}
                      onClick={() => setChatLogMode("full")}
                    >
                      전체
                    </button>
                  </div>
                  <pre className="assistant-log">{chatLog}</pre>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="prompt-panel">
          <div className="panel-title">Prompt</div>
          <div className="model-select">
            <span className="tone-label">모델 선택</span>
            <select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              disabled={!models.length || running}
            >
              {models.length === 0 && <option value="">모델 없음</option>}
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name || model.id}
                </option>
              ))}
            </select>
          </div>
          <div className="tone-toggle">
            <span className="tone-label">답변 톤</span>
            <div className="tone-buttons">
              <button
                className={`tone-button ${toneMode === "friendly" ? "active" : ""}`}
                onClick={() => setToneMode("friendly")}
                disabled={running}
              >
                친절
              </button>
              <button
                className={`tone-button ${toneMode === "plain" ? "active" : ""}`}
                onClick={() => setToneMode("plain")}
                disabled={running}
              >
                간단
              </button>
            </div>
          </div>
          <div className="template-bar">
            {templates.map((template) => (
              <button
                key={template.label}
                className="template-button"
                onClick={() => setPrompt(template.text)}
                disabled={running}
              >
                {template.label}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="예: /workspace/tasks/inbox에 있는 작업을 한 건 처리해줘"
            rows={4}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                handleRun();
              }
            }}
          />
          <div className="prompt-actions">
            <button
              className="primary"
              onClick={handleRun}
              disabled={!prompt.trim() || running}
            >
              {running ? "실행 중" : "실행"}
            </button>
            <button
              className="ghost"
              onClick={() => setPrompt("")}
              disabled={running}
            >
              비우기
            </button>
          </div>
          {notice && <div className="notice">{notice}</div>}
        </section>
      </main>

      <aside className="panel panel-right">
        <div className="panel-title">Inspector</div>
        <div className="tabs">
          <button
            className={`tab ${inspectorTab === "log" ? "active" : ""}`}
            onClick={() => setInspectorTab("log")}
          >
            로그
          </button>
          <button
            className={`tab ${inspectorTab === "tools" ? "active" : ""}`}
            onClick={() => setInspectorTab("tools")}
          >
            Tools
          </button>
          <button
            className={`tab ${inspectorTab === "info" ? "active" : ""}`}
            onClick={() => setInspectorTab("info")}
          >
            실행 정보
          </button>
        </div>
        {inspectorTab === "log" && (
          <div className="inspector-log">
            <pre className="log">{log.trim() ? log : "로그가 아직 없습니다."}</pre>
          </div>
        )}
        {inspectorTab === "tools" && (
          <div className="inspector-log">
            {toolEvents.length === 0 ? (
              <div className="empty">tool 이벤트가 아직 없습니다.</div>
            ) : (
              <div className="tool-events">
                {toolEvents.map((event, index) => (
                  <div className="tool-card" key={`${event.toolCallId}-${index}`}>
                    <div className="tool-row">
                      <span className={`tool-kind ${event.kind}`}>
                        {event.kind}
                      </span>
                      <span className="tool-name">{event.tool || "-"}</span>
                      <span className="tool-time">{event.at || "-"}</span>
                    </div>
                    <div className="tool-meta">
                      <span className="mono">{event.toolCallId || "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {inspectorTab === "info" && (
          <div className="inspector-info">
            <div className="info-row">
              <span>상태</span>
              <span>{activeRun ? statusLabels[activeRun.status] : "-"}</span>
            </div>
            <div className="info-row">
              <span>모델</span>
              <span>{activeRun?.modelId || selectedModel || "qwen2.5:14b"}</span>
            </div>
            <div className="info-row">
              <span>설정 파일</span>
              <span className="mono">{activeRun?.configPath || "-"}</span>
            </div>
            <div className="info-row">
              <span>실행 시간</span>
              <span>{activeRun?.durationMs ? `${activeRun.durationMs}ms` : "-"}</span>
            </div>
            <div className="info-row">
              <span>시작</span>
              <span>{formatTime(activeRun?.createdAt)}</span>
            </div>
            <div className="info-row">
              <span>종료</span>
              <span>{formatTime(activeRun?.completedAt)}</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
