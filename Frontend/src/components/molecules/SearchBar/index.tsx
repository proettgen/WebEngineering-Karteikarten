import React from "react";
import * as SC from "./styles";
import { SearchBarProps } from "./types";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  return (
    <SC.SearchBarWrapper>
      <Input type="text" placeholder={placeholder} />
      <Button label="Search" onClick={onSearch} />
    </SC.SearchBarWrapper>
  );
}