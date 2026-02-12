import React, { useEffect } from "react";

export default function ApproveModal({ open, pendingCount, onApprove, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-title">승인이 필요합니다</div>
        <div className="modal-body">
          이 요청은 위험 동작을 포함할 수 있어요. 승인되지 않은 상태로는 실행할 수 없습니다.
          (필요 승인: {pendingCount})
        </div>
        <div className="modal-actions">
          <button className="ghost" onClick={onCancel}>
            취소
          </button>
          <button className="primary" onClick={onApprove}>
            승인 설정 열기
          </button>
        </div>
      </div>
    </div>
  );
}

