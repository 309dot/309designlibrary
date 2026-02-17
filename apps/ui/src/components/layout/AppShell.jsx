import React from "react";

export default function AppShell({
  left,
  center,
  right,
  mode,
  leftCollapsed,
  drawerOpen,
  onCloseOverlays
}) {
  return (
    <div
      className={`app-shell mode-${mode || "assistant"} ${
        leftCollapsed ? "left-collapsed" : ""
      } ${drawerOpen ? "drawer-open" : "drawer-closed"}`}
    >
      <button
        className="scrim"
        type="button"
        aria-label="오버레이 닫기"
        onClick={() => onCloseOverlays?.()}
      />
      <aside className="panel panel-left">{left}</aside>
      <main className="panel panel-center">{center}</main>
      {right ? (
        <aside
          className="panel panel-right"
          aria-hidden={drawerOpen ? undefined : true}
          inert={drawerOpen ? undefined : ""}
        >
          {drawerOpen ? right : null}
        </aside>
      ) : null}
    </div>
  );
}
