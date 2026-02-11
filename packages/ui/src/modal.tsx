import * as React from "react";
import { cn } from "./utils";

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="ui-modal__overlay" role="presentation" onClick={onClose}>
      <div
        className={cn("ui-modal", className)}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <div className="ui-modal__header">{title}</div> : null}
        <div className="ui-modal__body">{children}</div>
        <div className="ui-modal__footer">
          <button className="ui-button ui-button--secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
