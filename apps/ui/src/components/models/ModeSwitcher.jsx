import React from "react";

const modes = [
  { key: "assistant", label: "비서" },
  { key: "dev", label: "개발" },
  { key: "design", label: "설계" }
];

export default function ModeSwitcher({ value, onChange, disabled }) {
  return (
    <div className="mode-dropdown">
      <span className="meta-label">모드</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {modes.map((mode) => (
          <option key={mode.key} value={mode.key}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
