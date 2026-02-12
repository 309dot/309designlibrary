import React, { useEffect, useMemo, useRef } from "react";

export default function PromptComposer({
  request,
  onChangeRequest,
  onSend,
  onSendPlan,
  mode,
  onChangeMode,
  models,
  selectedModel,
  onChangeModel,
  planMode,
  onTogglePlanMode,
  debugEnabled,
  onToggleDebug,
  disabled
}) {
  const textareaRef = useRef(null);

  const placeholder = useMemo(
    () => "메시지를 입력하세요…",
    []
  );

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const onKeyDown = (event) => {
      if (event.key !== "Enter") return;
      if (event.isComposing) return;

      const isCmd = event.metaKey && !event.ctrlKey;
      const isCmdShift = event.metaKey && event.shiftKey && !event.ctrlKey;
      if (isCmdShift) {
        event.preventDefault();
        onSendPlan?.();
        return;
      }
      if (event.shiftKey) return; // newline
      if (isCmd) {
        event.preventDefault();
        onSend?.();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [onSend, onSendPlan]);

  return (
    <div className="composer">
      <div className="composer-input">
        <textarea
          ref={textareaRef}
          value={request}
          onChange={(event) => onChangeRequest(event.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
        />

        <button
          className="primary composer-send"
          onClick={onSend}
          disabled={disabled || !request.trim()}
        >
          ↑
        </button>
      </div>

      <div className="composer-controls">
        <select
          className="composer-select"
          value={selectedModel}
          onChange={(e) => onChangeModel?.(e.target.value)}
          disabled={disabled}
          title="모델"
        >
          {models?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name || m.id}
            </option>
          ))}
        </select>

        <select
          className="composer-select"
          value={mode}
          onChange={(e) => onChangeMode?.(e.target.value)}
          disabled={disabled}
          title="모드"
        >
          <option value="assistant">비서</option>
          <option value="dev">개발</option>
          <option value="design">설계</option>
        </select>

        <label className="composer-check">
          <input
            type="checkbox"
            checked={Boolean(planMode)}
            onChange={() => onTogglePlanMode?.(!planMode)}
            disabled={disabled}
          />
          <span>Plan</span>
        </label>

        <label className="composer-check">
          <input
            type="checkbox"
            checked={Boolean(debugEnabled)}
            onChange={() => onToggleDebug?.(!debugEnabled)}
            disabled={disabled}
          />
          <span>Debug</span>
        </label>
      </div>
    </div>
  );
}
