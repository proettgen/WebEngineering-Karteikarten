import React from "react";
import * as SC from "./styles";
import { TextareaProps } from "./types";

export default function Textarea({ placeholder, value, onChange }: TextareaProps) {
  return (
    <SC.Textarea placeholder={placeholder} value={value} onChange={onChange} />
  );
}