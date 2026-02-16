"use client";

import { useEffect } from "react";
import './modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
                                isOpen,
                                onClose,
                                title,
                                children,
                              }: ModalProps) {
// Close on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
