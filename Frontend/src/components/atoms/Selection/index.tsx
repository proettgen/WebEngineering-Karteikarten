import React from "react";
import * as SC from "./styles";
import { SelectionProps } from "./types";

export default function Selection({ options, onChange }: SelectionProps) {
  return (
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
}