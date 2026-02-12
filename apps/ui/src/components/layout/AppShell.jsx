import React from "react";

export default function AppShell({
  left,
  center,
  right,
  mode,
  leftCollapsed,
  drawerOpen
}) {
  return (
    <div
      className={`app-shell mode-${mode || "assistant"} ${
        leftCollapsed ? "left-collapsed" : ""
      } ${drawerOpen ? "drawer-open" : "drawer-closed"}`}
    >
      <aside className="panel panel-left">{left}</aside>
      <main className="panel panel-center">{center}</main>
      <aside className="panel panel-right" aria-hidden={!drawerOpen}>
        {right}
      </aside>
    </div>
  );
}
