"use client";

import React, { useMemo } from "react";
import { Folder } from "@/database/folderTypes";
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
        return sorted.sort((a, b) => {
          // Handle null values: folders without lastOpenedAt go to the end
          const aTime = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
          const bTime = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
          return bTime - aTime;
        });
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
          placeholder="Search folders..."
          initialValue={searchTerm}
        />
        <SortButton
          onSortChange={onSort}
          currentSortOption={sortOption}
        />
      </SC.TopControlsContainer>

      {/* Breadcrumb Navigation with Add Folder Button */}
      {!isSearching && (
        <SC.BreadcrumbSection>
          <SC.BreadcrumbHeader>
            <SC.BreadcrumbContainer>
              {/* Root is always the first element */}
              <SC.BreadcrumbItem 
                $isActive={breadcrumb.length === 0}
                onClick={() => handleBreadcrumbClick(null)}
              >
                Root
              </SC.BreadcrumbItem>
              
              {/* Show breadcrumb trail if we're not at root */}
              {breadcrumb.length > 0 && (
                <>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <SC.BreadcrumbSeparator>/</SC.BreadcrumbSeparator>
                      <SC.BreadcrumbItem 
                        $isActive={index === breadcrumb.length - 1}
                        onClick={() => handleBreadcrumbClick(item)}
                      >
                        {item.name}
                      </SC.BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </>
              )}
            </SC.BreadcrumbContainer>
            
            {/* Modern Add Folder Button */}
            <SC.AddFolderButton onClick={onAddFolder} title="Add subfolder">
              <Icon size="s" color="textPrimary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>
              </Icon>
            </SC.AddFolderButton>
          </SC.BreadcrumbHeader>
        </SC.BreadcrumbSection>
      )}

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
            <SC.EmptyStateContainer>
              <SC.EmptyStateIcon>
                <Icon size="m" color="textSecondary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Zm240-200v40q0 17 11.5 28.5T440-360q17 0 28.5-11.5T480-400v-40h40q17 0 28.5-11.5T560-480q0-17-11.5-28.5T520-520h-40v-40q0-17-11.5-28.5T440-600q-17 0-28.5 11.5T400-560v40h-40q-17 0-28.5 11.5T320-480q0 17 11.5 28.5T360-440h40Z"/>
                  </svg>
                </Icon>
              </SC.EmptyStateIcon>
              <SC.EmptyStateText>
                {currentParentId === null 
                  ? "No folders yet" 
                  : "Empty folder"}
              </SC.EmptyStateText>
              <SC.EmptyStateSubtext>
                {currentParentId === null 
                  ? "Create your first folder to get started"
                  : "Add a subfolder using the button above"}
              </SC.EmptyStateSubtext>
            </SC.EmptyStateContainer>
          )}
          {displayedFolders.length === 0 && isSearching && (
            <SC.EmptyStateContainer>
              <SC.EmptyStateIcon>
                <Icon size="m" color="textSecondary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>
                </Icon>
              </SC.EmptyStateIcon>
              <SC.EmptyStateText>
                No results found
              </SC.EmptyStateText>
              <SC.EmptyStateSubtext>
                Try different search terms or check spelling
              </SC.EmptyStateSubtext>
            </SC.EmptyStateContainer>
          )}
        </SC.FolderList>
      )}
    </SC.AsideContainer>
  );
};

export default FolderNavigationAside;
