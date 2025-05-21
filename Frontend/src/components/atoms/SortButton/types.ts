export type SortOption = "date" | "name" | "lastUsed";

export interface SortButtonProps {
  /**
   * Callback function that is called when a sort option is selected.
   * @param option The selected sort option.
   */
  onSortChange: (_option: SortOption) => void;
  /**
   * The currently active sort option, to highlight it in the dropdown.
   */
  currentSortOption?: SortOption;
  /**
   * The initial sort option if `currentSortOption` is not provided.
   * @default "name"
   */
  initialSortOption?: SortOption;
}
