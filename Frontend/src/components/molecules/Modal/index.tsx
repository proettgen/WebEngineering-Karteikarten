import React from "react";
import { createPortal } from "react-dom";
import * as SC from "./styles";
import { ModalProps } from "./types";

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <SC.Overlay onClick={onClose}>
      <SC.Modal onClick={(e) => e.stopPropagation()}>
        <SC.CloseButton onClick={onClose}>×</SC.CloseButton>
        {children}
      </SC.Modal>
    </SC.Overlay>,
    document.body
  );
};
export default Modal;
