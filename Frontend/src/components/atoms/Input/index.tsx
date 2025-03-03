import React from "react";
import * as SC from "./styles";
import { InputProps } from "./types";

export default function Input({ type, placeholder }: InputProps) {
  return (
    <SC.Input type={type} placeholder={placeholder} />
  );
}