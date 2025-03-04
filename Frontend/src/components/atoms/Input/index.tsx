import React from "react";
import * as SC from "./styles";
import { InputProps } from "./types";

export default function Input({ type, placeholder, value, onChange }: InputProps) {
  return (
    <SC.Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
  );
}