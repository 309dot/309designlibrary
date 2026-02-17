import React, { useEffect, useRef } from "react";

export default function OverflowMenu({
  open,
  onClose,
  devDrawerEnabled,
  onToggleDevDrawer
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    const onClick = (event) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target)) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="menu-popover" role="menu" ref={ref}>
      <div className="menu-section">
        <div className="menu-title">보기</div>
        <label className="menu-row">
          <span>Developer Drawer</span>
          <input
            type="checkbox"
            checked={Boolean(devDrawerEnabled)}
            onChange={() => onToggleDevDrawer?.(!devDrawerEnabled)}
          />
        </label>
        <div className="menu-help">
          Developer Drawer를 켜면 패널(Plan/로그/Diff/권한/MCP 상태)을 볼 수 있습니다.
        </div>
      </div>
    </div>
  );
}

