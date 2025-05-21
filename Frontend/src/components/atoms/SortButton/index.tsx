import React, { useState, useEffect, useRef } from "react";
import * as SC from "./styles";
import Icon from "@/components/atoms/Icon";
import { SortButtonProps, SortOption } from "./types";

const SortButton: React.FC<SortButtonProps> = ({
  onSortChange,
  currentSortOption,
  initialSortOption = "name",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortOption>(
    currentSortOption || initialSortOption,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update selectedOption if currentSortOption prop changes
  useEffect(() => {
    if (currentSortOption) {
      setSelectedOption(currentSortOption);
    }
  }, [currentSortOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: SortOption) => {
    setSelectedOption(option);
    onSortChange(option);
    setIsOpen(false);
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name", label: "Name (A-Z)" },
    { value: "date", label: "Date (Newest)" },
    { value: "lastUsed", label: "Last Used" },
  ];

  return (
    <SC.SortButtonWrapper ref={wrapperRef}>
      <SC.StyledSortButton
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Icon size="m" color="textPrimary" cursorStyle="pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            style={{ transform: "scaleX(-1)" }}
          >
            <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </Icon>
      </SC.StyledSortButton>
      <SC.DropdownMenu $isOpen={isOpen} role="menu">
        {sortOptions.map((option) => (
          <SC.DropdownItem
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            $isActive={selectedOption === option.value}
            role="menuitem"
          >
            {option.label}
          </SC.DropdownItem>
        ))}
      </SC.DropdownMenu>
    </SC.SortButtonWrapper>
  );
};

export default SortButton;
