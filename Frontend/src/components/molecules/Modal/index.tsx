import React from "react";
import * as SC from "./styles";
import { ModalProps } from "./types";

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <SC.Overlay onClick={onClose}>
      <SC.Modal onClick={(e) => e.stopPropagation()}>
        <SC.CloseButton onClick={onClose}>×</SC.CloseButton>
        {children}
      </SC.Modal>
    </SC.Overlay>
  );
};
export default Modal;
