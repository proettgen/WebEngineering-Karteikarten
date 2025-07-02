import React, { useEffect, useState } from "react";
import * as SC from "./styles";
import { SearchBarProps } from "./types";
import Icon from "@/components/atoms/Icon";

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // Trigger search immediately when input is cleared
    if (newValue.trim() === '') {
      onSearch('');
    }
  };

  const triggerSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();
    onSearch(trimmedSearchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default if inside a form
      triggerSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const isInputFilled = searchTerm.trim() !== "";

  return (
    <SC.SearchBarContainer>
      <Icon color="textSecondary" size="m">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </Icon>
      <SC.StyledInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      {isInputFilled && (
        <>
          <Icon
            size="m"
            color="textSecondary"
            onClick={clearSearch}
            cursorStyle="pointer"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </Icon>
          <Icon
            size="m"
            color="primary"
            onClick={triggerSearch}
            cursorStyle="pointer"
            aria-label="Submit search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
          </Icon>
        </>
      )}
    </SC.SearchBarContainer>
  );
};

export default SearchBar;
