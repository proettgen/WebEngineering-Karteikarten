import React, { useState } from "react";
import * as SC from "./styles";
import { SearchBarProps } from "./types";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
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
      <Button onClick={onSearch}>Search</Button>
    </SC.SearchBarWrapper>
  );
};
export default SearchBar;
