import React from "react";
import * as SC from "./styles";
import { InputProps } from "./types";

const Input = ({ type, placeholder, value, onChange }: InputProps) => (
  <SC.Input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);
export default Input;
