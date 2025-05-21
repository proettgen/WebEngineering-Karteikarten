export interface SearchBarProps {
  /**
   * Placeholder text for the search input.
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * Callback function triggered when a search is initiated.
   * @param searchTerm The current value of the search input.
   */
  onSearch: (_searchTerm: string) => void;
  /**
   * Optional initial value for the search input.
   */
  initialValue?: string;
}
