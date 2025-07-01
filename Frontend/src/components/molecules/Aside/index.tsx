"use client";

import React, { useMemo } from "react";
import { useTheme } from "styled-components";
import { Folder } from "@/database/folderTypes";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";
import { AsideProps, BreadcrumbItem } from "./types";
import * as SC from "./styles";
import Icon from "@/components/atoms/Icon";
import SortButton from "@/components/atoms/SortButton";
import { SortOption } from "@/components/atoms/SortButton/types";
import SearchBar from "../SearchBar";

const FolderNavigationAside: React.FC<AsideProps> = ({
  currentFolders,
  currentParentId,
  selectedFolderId,
  breadcrumb,
  searchTerm,
  sortOption,
  onFolderSelect,
  onBreadcrumbNavigate,
  onSearch,
  onSort,
  onAddFolder,
  loading = false
}) => {
  const theme = useTheme() as ThemeType;
  const isSearching = searchTerm.trim() !== "";

  // Find the currently selected folder object
  const selectedFolder = useMemo(
    () => currentFolders.find((f) => f.id === selectedFolderId) ?? null,
    [currentFolders, selectedFolderId]
  );

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

  // List of folders to display (all folders since filtering is handled in parent)
  const displayedFolders = useMemo((): Folder[] => 
    sortFolders(currentFolders, sortOption), 
    [currentFolders, sortOption]
  );

  // Handle click on a folder item (to select it)
  const handleFolderClick = (clickedFolder: Folder): void => {
    onFolderSelect(clickedFolder.id);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (item: BreadcrumbItem | null): void => {
    onBreadcrumbNavigate(item ? item.id : null);
  };

  return (
    <SC.AsideContainer>
      <SC.TopControlsContainer>
        <SearchBar
          onSearch={onSearch}
          placeholder="Search..."
          initialValue={searchTerm}
        />
        <SortButton
          onSortChange={onSort}
          currentSortOption={sortOption}
        />
      </SC.TopControlsContainer>

      {/* Breadcrumb Navigation */}
      {breadcrumb.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <SC.BackButton onClick={() => handleBreadcrumbClick(null)}>
            <Icon size="s" color="textPrimary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 960">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
              </svg>
            </Icon>
            Root
          </SC.BackButton>
          
          {/* Breadcrumb trail */}
          <SC.BreadcrumbContainer>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <SC.BreadcrumbSeparator>/</SC.BreadcrumbSeparator>
                )}
                <SC.BreadcrumbItem 
                  $isActive={index === breadcrumb.length - 1}
                  onClick={() => handleBreadcrumbClick(item)}
                >
                  {item.name}
                </SC.BreadcrumbItem>
              </React.Fragment>
            ))}
          </SC.BreadcrumbContainer>
        </div>
      )}

      {/* Add Folder Button */}
      <SC.AddFolderButton onClick={onAddFolder}>
        <Icon size="s" color="textPrimary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z" />
          </svg>
        </Icon>
        Add Folder
      </SC.AddFolderButton>

      {/* Selected Folder Display */}
      {selectedFolder && (
        <SC.SelectedFolderItem $isSelected={true} title={selectedFolder.name}>
          <SC.FolderName>Selected: {selectedFolder.name}</SC.FolderName>
        </SC.SelectedFolderItem>
      )}

      {/* Folder List */}
      {loading ? (
        <SC.LoadingContainer>Loading folders...</SC.LoadingContainer>
      ) : (
        <SC.FolderList>
          {displayedFolders.map((folder) => (
            <SC.FolderItem
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              $isSelected={folder.id === selectedFolderId}
              title={`${folder.name} (Click to select and view content)`}
            >
              <SC.FolderName>{folder.name}</SC.FolderName>
            </SC.FolderItem>
          ))}
          {displayedFolders.length === 0 && !isSearching && (
            <SC.FolderItem
              $isSelected={false}
              style={{ cursor: "default", justifyContent: "center" }}
            >
              <SC.FolderName
                style={{ textAlign: "center", color: theme.textSecondary }}
              >
                {currentParentId === null 
                  ? "No folders yet. Create your first folder!" 
                  : "This folder has no subfolders. Add one!"}
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
      )}
    </SC.AsideContainer>
  );
};

export default FolderNavigationAside;
