import React, { useState } from "react";
import * as SC from "./styles";
import { SearchBarProps } from "./types";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <SC.SearchBarWrapper>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
      />
      <Button label="Search" onClick={onSearch} />
    </SC.SearchBarWrapper>
  );
}