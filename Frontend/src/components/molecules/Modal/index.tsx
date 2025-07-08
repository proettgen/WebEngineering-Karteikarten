import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import * as SC from "./styles";
import { ModalProps } from "./types";

const Modal = React.memo(({ isOpen, onClose, children }: ModalProps) => {
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <SC.Overlay onClick={handleOverlayClick}>
      <SC.Modal onClick={handleModalClick}>
        <SC.CloseButton onClick={onClose}>×</SC.CloseButton>
        {children}
      </SC.Modal>
    </SC.Overlay>,
    document.body
  );
});

Modal.displayName = 'Modal';

export default Modal;
