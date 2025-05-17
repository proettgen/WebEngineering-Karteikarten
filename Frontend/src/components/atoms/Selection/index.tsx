import React from "react";
import * as SC from "./styles";
import { SelectionProps } from "./types";

const Selection = ({ options, onChange }: SelectionProps) => (
  <SC.SelectionWrapper>
    <SC.Label htmlFor="selection">Select an option:</SC.Label>
    <SC.Select id="selection" onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </SC.Select>
  </SC.SelectionWrapper>
);
export default Selection;
