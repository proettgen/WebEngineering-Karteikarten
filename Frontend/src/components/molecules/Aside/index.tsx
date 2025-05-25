// components/organisms/FolderNavigationAside/index.tsx
"use client"; // This component uses React hooks, so it must be a client component

import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "styled-components"; // Import useTheme hook
import { Folder } from "./types"; // Ensure ThemeType is imported if not already via styled.d.ts
import { ThemeType } from "@/components/templates/ThemeWrapper/types";
import * as SC from "./styles";
import mockData from "./mockFolders.json";
import Icon from "@/components/atoms/Icon"; // Assuming mockFolders.json is in the same directory
import SortButton from "@/components/atoms/SortButton"; // Import SortOption
import { SortOption } from "@/components/atoms/SortButton/types";
import SearchBar from "../SearchBar";

// The mockFolders.json file should be structured as:
// { "folders": [ { "id": "...", "name": "...", "parentId": "..." | null, "createdAt": "..." } ] }
// For this example, we directly use the folders array from the imported JSON.
const initialFolders: Folder[] = mockData.folders;

/**
 * AsideNavigationOrganism component for browsing a folder hierarchy.
 */
const FolderNavigationAside: React.FC = () => {
  // State for all folders, current parent ID to display, and selected folder ID
  const [allFolders] = useState<Folder[]>(initialFolders); // Keep original list
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const selectedFolder = useMemo(
  () => allFolders.find((f) => f.id === selectedFolderId) ?? null,
  [allFolders, selectedFolderId]
); 

  // Access the theme object
  const theme = useTheme() as ThemeType; // Cast to ThemeType for type safety

  // --- New States for Search and Sort ---
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Folder[]>([]);
  const [currentSortOption, setCurrentSortOption] =
    useState<SortOption>("name");

  const isSearching = searchTerm.trim() !== "";

  // --- API Call Comments --- //IMPORTANT remove underscore from folderId (it's just an ESLint workaround)
  const updateFolderLastOpenedAt = async (_folderId: string) => {
    // TODO: API Call to update lastOpenedAt for folderId
    // try {
    //   const response = await fetch(`/api/folders/${folderId}/touch`, { method: 'PATCH' });
    //   if (!response.ok) throw new Error('Failed to update lastOpenedAt');
    //   // Optionally refetch folders or update local state if backend returns updated folder
    //   console.log(`Folder ${folderId} lastOpenedAt updated.`);
    // } catch (error) {
    //   console.error("Error updating lastOpenedAt:", error);
    // }
  };

  // --- Search Logic ---
  useEffect(() => {
    if (isSearching) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const results = allFolders.filter((folder) =>
        folder.name.toLowerCase().includes(lowerSearchTerm),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allFolders, isSearching]);

  // --- Sorting Logic ---
  const sortFolders = (
    foldersToSort: Folder[],
    sortOption: SortOption,
  ): Folder[] => {
    const sorted = [...foldersToSort]; // Create a new array to avoid mutating state directly
    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "date": // Assuming createdAt, newest first
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "lastUsed": // Assuming lastOpenedAt, most recent first
        return sorted.sort(
          (a, b) =>
            new Date(b.lastOpenedAt).getTime() -
            new Date(a.lastOpenedAt).getTime(),
        );
      default:
        return sorted;
    }
  };

  /**
   * Memoized calculation to find the folder object for the current parent ID.
   */
  const currentParentFolderObject = useMemo(
    (): Folder | undefined =>
      allFolders.find((folder) => folder.id === currentParentId),
    [allFolders, currentParentId],
  );

  /**
   * Memoized calculation for the parent of the current view, used for the back button.
   */
  const parentOfCurrentViewForBackBtn = useMemo((): Folder | undefined => {
    if (
      !currentParentFolderObject ||
      currentParentFolderObject.parentId === null
    ) {
      return undefined; // At root or currentParentFolderObject is a root item itself
    }
    return allFolders.find(
      (folder) => folder.id === currentParentFolderObject.parentId,
    );
  }, [allFolders, currentParentFolderObject]);

  /**
   * Memoized list of folders to display based on the currentParentId.
   * Shows root folders if currentParentId is null.
   */
  const displayedFolders = useMemo((): Folder[] => {
    if (isSearching) {
      return sortFolders(searchResults, currentSortOption);
    }
    const filtered = allFolders.filter(
      (folder) => folder.parentId === currentParentId,
    );
    return sortFolders(filtered, currentSortOption);
  }, [
    allFolders,
    currentParentId,
    isSearching,
    searchResults,
    currentSortOption,
  ]);

  /**
   * Helper function to check if a folder has subfolders.
   * @param folderId - The ID of the folder to check.
   * @returns True if the folder has subfolders, false otherwise.
   */
  const hasSubfolders = useMemo(
    () =>
      (folderId: string): boolean =>
        allFolders.some((folder) => folder.parentId === folderId),
    [allFolders],
  );

  const getParentFolderName = (parentId: string | null): string | null => {
    if (!parentId) return null;
    const parent = allFolders.find((f) => f.id === parentId);
    return parent ? parent.name : null;
  };

  /**
   * Handles the click event on a folder item.
   * Implements the three specified behaviors for folder selection and navigation.
   * @param clickedFolder - The folder object that was clicked.
   */
  const handleFolderClick = (clickedFolder: Folder): void => {
    const folderHasSubfolders = hasSubfolders(clickedFolder.id);

    if (isSearching) {
      // When clicking a search result, navigate to its actual location and clear search
      setSearchTerm(""); // Clear search
      // TODO: If SearchBar needs explicit clearing, trigger its prop here
      // e.g., if SearchBar had a `clearSearch` prop: clearSearchBar();
      setCurrentParentId(clickedFolder.parentId);
      setSelectedFolderId(clickedFolder.id);
      updateFolderLastOpenedAt(clickedFolder.id); // Update last opened
      return;
    }

    if (folderHasSubfolders) {
      // Behavior 3: Folder has subfolders - navigate into it
      setSelectedFolderId(clickedFolder.id);
      setCurrentParentId(clickedFolder.id);
      updateFolderLastOpenedAt(clickedFolder.id);
    } else {
      // Folder does not have subfolders
      if (selectedFolderId === clickedFolder.id) {
        // Behavior 2: Clicking an already selected folder (no subfolders) - deselect and select its parent
        setSelectedFolderId(clickedFolder.parentId); // parentId can be null, which is handled
      } else {
        // Behavior 1: Clicking a new folder (no subfolders) - select it, keep current view
        setSelectedFolderId(clickedFolder.id);
        updateFolderLastOpenedAt(clickedFolder.id);
      }
    }
  };

  /**
   * Handles the click event for the "Back" button.
   * Navigates one level up in the folder hierarchy.
   */
  const handleBackClick = (): void => {
    if (isSearching) {
      setSearchTerm("");
      // TODO: If SearchBar needs explicit clearing, trigger its prop here
      setCurrentParentId(null); // Go to root
      setSelectedFolderId(null);
      return;
    }

    if (!currentParentFolderObject) return; // Should not happen if button is enabled

    // The new parent ID will be the parent of the current folder being viewed
    const newParentId = currentParentFolderObject.parentId;
    setCurrentParentId(newParentId);
    // When going back, the folder we were just "in" (currentParentFolderObject) remains selected
    setSelectedFolderId(currentParentFolderObject.id);
  };

  const backButtonText = useMemo((): string => {
    if (isSearching) return "Clear Search";
    if (!currentParentFolderObject) return "Up"; // Should be disabled anyway
    if (parentOfCurrentViewForBackBtn) {
      return `${parentOfCurrentViewForBackBtn.name}`;
    }
    return "Your Folders";
  }, [currentParentFolderObject, parentOfCurrentViewForBackBtn, isSearching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentParentId(null); // When searching, view is not tied to a parent
    setSelectedFolderId(null);
  };

  const handleSortChange = (option: SortOption) => {
    setCurrentSortOption(option);
  };

  return (
    <SC.AsideContainer>
      <SC.TopControlsContainer>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search..." // Updated placeholder
          initialValue={searchTerm}
        />
        <SortButton
          onSortChange={handleSortChange}
          currentSortOption={currentSortOption}
        />
      </SC.TopControlsContainer>

      {(currentParentId !== null || isSearching) && (
        <SC.BackButton
          onClick={handleBackClick}
          disabled={!isSearching && !currentParentFolderObject}
        >
          <Icon size="s" color="textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
          </Icon>
          <SC.FolderName>{backButtonText}</SC.FolderName>
        </SC.BackButton>
      )}
      {selectedFolder && (
        <SC.SelectedFolderItem $isSelected={true} title={selectedFolder.name}>
          <SC.FolderName>{selectedFolder.name}</SC.FolderName>
          <SC.EditButton
            aria-label="Edit folder"
            onClick={e => {
              e.stopPropagation();
              // TODO: Replace with your edit handler
              alert(`Edit folder: ${selectedFolder.name}`);
            }}
          >
            <Icon size="s" color="textPrimary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </Icon>
          </SC.EditButton>
        </SC.SelectedFolderItem>
      )}
      <SC.FolderList>
        {displayedFolders.map((folder) => {
          const parentName = isSearching
            ? getParentFolderName(folder.parentId)
            : null;
          // In normal view (!isSearching), displayName will just be folder.name
          const displayName = isSearching
            ? parentName
              ? `${folder.name} (in ${parentName})`
              : `${folder.name} (in Root)`
            : folder.name;

          return (
            <SC.FolderItem
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              $isSelected={folder.id === selectedFolderId && !isSearching}
              title={folder.name}
            >
              <SC.FolderName>{displayName}</SC.FolderName>
              {hasSubfolders(folder.id) && !isSearching && (
                <Icon size="s" color="textSecondary" cursorStyle="pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                  </svg>
                </Icon>
              )}
            </SC.FolderItem>
          );
        })}
        {displayedFolders.length === 0 &&
          currentParentId !== null &&
          !isSearching && (
            <SC.FolderItem
              $isSelected={false}
              style={{ cursor: "default", justifyContent: "center" }}
            >
              <SC.FolderName
                style={{ textAlign: "center", color: theme.textSecondary }}
              >
                This folder is empty.
              </SC.FolderName>
            </SC.FolderItem>
          )}
        {displayedFolders.length === 0 && isSearching && (
          <SC.FolderItem
            $isSelected={false}
            style={{ cursor: "default", justifyContent: "center" }}
          >
            <SC.FolderName
              style={{ textAlign: "center", color: theme.textSecondary }}
            >
              No folders found.
            </SC.FolderName>
          </SC.FolderItem>
        )}
      </SC.FolderList>
    </SC.AsideContainer>
  );
};

export default FolderNavigationAside;
