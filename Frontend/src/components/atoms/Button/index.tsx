import React from "react";
import * as SC from "./styles";
import { ButtonProps } from "./types";

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <SC.Button onClick={onClick}>
      {label}
    </SC.Button>
  );
}