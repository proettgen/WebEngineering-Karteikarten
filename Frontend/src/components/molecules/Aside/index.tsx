"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "styled-components";
import { Folder } from "@/database/folderTypes";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";
import * as SC from "./styles";
import Icon from "@/components/atoms/Icon";
import SortButton from "@/components/atoms/SortButton";
import { SortOption } from "@/components/atoms/SortButton/types";
import SearchBar from "../SearchBar";
import { apiService } from "@/services/apiService";

const FolderNavigationAside: React.FC = () => {
  // State for all folders, navigation, and selection
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // State for search and sort
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Folder[]>([]);
  const [currentSortOption, setCurrentSortOption] = useState<SortOption>("name");
  const isSearching = searchTerm.trim() !== "";

  // Fetch folders from backend on mount or when search/sort changes
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const params: any = {};
        if (isSearching) params.search = searchTerm;
        if (currentSortOption === "name") params.sortBy = "name";
        if (currentSortOption === "date") params.sortBy = "createdAt";
        if (currentSortOption === "lastUsed") params.sortBy = "lastOpenedAt";
        params.order = "asc";

        const res = await apiService.getFolders(params);
        if (isSearching) setSearchResults(res.data.folders);
        else setAllFolders(res.data.folders);
      } catch {
        setSearchResults([]);
        setAllFolders([]);
      }
    };
    fetchFolders();
  }, [searchTerm, isSearching, currentSortOption]);

  // Find the currently selected folder object
  const selectedFolder = useMemo(
    () => allFolders.find((f) => f.id === selectedFolderId) ?? null,
    [allFolders, selectedFolderId]
  );

  const theme = useTheme() as ThemeType;

  // Update lastOpenedAt for a folder (API call placeholder)
  const updateFolderLastOpenedAt = async (_folderId: string) => {
    // Implement API call to update lastOpenedAt if needed
  };

  // Sort folders based on the selected sort option
  const sortFolders = (foldersToSort: Folder[], sortOption: SortOption): Folder[] => {
    const sorted = [...foldersToSort];
    switch (sortOption) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "lastUsed":
        return sorted.sort(
          (a, b) => new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime()
        );
      default:
        return sorted;
    }
  };

  // Get the current parent folder object
  const currentParentFolderObject = useMemo(
    () => allFolders.find((folder) => folder.id === currentParentId),
    [allFolders, currentParentId]
  );

  // Get the parent of the current view (for the back button)
  const parentOfCurrentViewForBackBtn = useMemo(() => {
    if (!currentParentFolderObject || currentParentFolderObject.parentId === null) {
      return undefined;
    }
    return allFolders.find((folder) => folder.id === currentParentFolderObject.parentId);
  }, [allFolders, currentParentFolderObject]);

  // List of folders to display based on currentParentId or search
  const displayedFolders = useMemo((): Folder[] => {
    if (isSearching) {
      return sortFolders(searchResults, currentSortOption);
    }
    const filtered = allFolders.filter((folder) => folder.parentId === currentParentId);
    return sortFolders(filtered, currentSortOption);
  }, [allFolders, currentParentId, isSearching, searchResults, currentSortOption]);

  // Check if a folder has subfolders
  const hasSubfolders = useMemo(
    () => (folderId: string): boolean =>
      allFolders.some((folder) => folder.parentId === folderId),
    [allFolders]
  );

  // Get the name of a parent folder by its ID
  const getParentFolderName = (parentId: string | null): string | null => {
    if (!parentId) return null;
    const parent = allFolders.find((f) => f.id === parentId);
    return parent ? parent.name : null;
  };

  // Handle click on a folder item (navigation and selection logic)
  const handleFolderClick = (clickedFolder: Folder): void => {
    const folderHasSubfolders = hasSubfolders(clickedFolder.id);

    if (isSearching) {
      setSearchTerm("");
      setCurrentParentId(clickedFolder.parentId);
      setSelectedFolderId(clickedFolder.id);
      updateFolderLastOpenedAt(clickedFolder.id);
      return;
    }

    if (folderHasSubfolders) {
      setSelectedFolderId(clickedFolder.id);
      setCurrentParentId(clickedFolder.id);
      updateFolderLastOpenedAt(clickedFolder.id);
    } else {
      if (selectedFolderId === clickedFolder.id) {
        setSelectedFolderId(clickedFolder.parentId);
      } else {
        setSelectedFolderId(clickedFolder.id);
        updateFolderLastOpenedAt(clickedFolder.id);
      }
    }
  };

  // Handle click on the "Back" button (navigate up in hierarchy)
  const handleBackClick = (): void => {
    if (isSearching) {
      setSearchTerm("");
      setCurrentParentId(null);
      setSelectedFolderId(null);
      return;
    }

    if (!currentParentFolderObject) return;

    const newParentId = currentParentFolderObject.parentId;
    setCurrentParentId(newParentId);
    setSelectedFolderId(currentParentFolderObject.id);
  };

  // Determine the text for the back button
  const backButtonText = useMemo((): string => {
    if (isSearching) return "Clear Search";
    if (!currentParentFolderObject) return "Up";
    if (parentOfCurrentViewForBackBtn) {
      return `${parentOfCurrentViewForBackBtn.name}`;
    }
    return "Your Folders";
  }, [currentParentFolderObject, parentOfCurrentViewForBackBtn, isSearching]);

  // Handle search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentParentId(null);
    setSelectedFolderId(null);
  };

  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    setCurrentSortOption(option);
  };

  return (
    <SC.AsideContainer>
      <SC.TopControlsContainer>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search..."
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 960">
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
              // Replace with your edit handler
              alert(`Edit folder: ${selectedFolder.name}`);
            }}
          >
            <Icon size="s" color="textPrimary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 960 960"
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
                    viewBox="0 0 960 960"
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
