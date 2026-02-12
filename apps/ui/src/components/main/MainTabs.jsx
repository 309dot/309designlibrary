import React from "react";

const tabs = [
  { key: "conversation", label: "Conversation" },
  { key: "plan", label: "Plan" },
  { key: "act", label: "Act" },
  { key: "verify", label: "Verify" },
  { key: "done", label: "Done" }
];

export default function MainTabs({ active, onChange, badges }) {
  return (
    <div className="main-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`main-tab ${active === tab.key ? "active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          <span>{tab.label}</span>
          {badges?.[tab.key] ? <span className="tab-badge" /> : null}
        </button>
      ))}
    </div>
  );
}

