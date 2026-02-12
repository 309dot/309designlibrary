import React from "react";

export default function RightDrawerTabs({ active, onChange, debugEnabled }) {
  const tabs = [
    { key: "steps", label: "실행 단계" },
    { key: "approval", label: "승인" },
    { key: "debug", label: "Debug", disabled: !debugEnabled },
    { key: "settings", label: "설정" }
  ];
  return (
    <div className="drawer-tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`drawer-tab ${active === t.key ? "active" : ""}`}
          onClick={() => onChange(t.key)}
          disabled={t.disabled}
          title={t.disabled ? "Debug를 켜야 볼 수 있습니다." : ""}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

