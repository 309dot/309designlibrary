import React from "react";

export default function TopBarMinimal({
  leftCollapsed,
  drawerOpen,
  onToggleLeft,
  onToggleDrawer
}) {
  return (
    <header className="topbar-min">
      <div className="topbar-min-left">
        <button
          className="ghost icon-button"
          onClick={() => {
            // 닫기는 사이드바 내부에서만 한다. (헤더 버튼은 "열기"만)
            if (leftCollapsed) onToggleLeft?.();
          }}
          title="Threads 열기"
          type="button"
        >
          ☰
        </button>
        <div className="brandmark">309Agent</div>
      </div>

      <div className="topbar-min-right">
        <button
          className="ghost icon-button"
          onClick={() => {
            // 닫기는 패널 내부에서만 한다. (헤더 버튼은 "열기"만)
            if (!drawerOpen) onToggleDrawer?.();
          }}
          title="패널 열기"
          type="button"
        >
          ≡
        </button>
      </div>
    </header>
  );
}
