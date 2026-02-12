import React from "react";

export default function ModelPresetPicker({
  models,
  selectedModel,
  onModelChange,
  disabled
}) {
  return (
    <div className="model-picker">
      <span className="meta-label">모델</span>
      <select
        value={selectedModel}
        onChange={(event) => onModelChange(event.target.value)}
        disabled={disabled}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name || model.id}
          </option>
        ))}
      </select>
    </div>
  );
}
