import React, { useState, useEffect, useMemo } from "react";
import { FolderData, FolderAsideProps } from "./types";
import * as SC from "./styles";
import mockFolders from "./mockFolders.json";

const FolderAside: React.FC<FolderAsideProps> = ({
  onFolderSelect,
  initialSelectedFolderId = null,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    initialSelectedFolderId,
  );
  const [currentViewFolderId, setCurrentViewFolderId] = useState<string | null>(
    null,
  );

  const folderData = mockFolders as FolderData;

  // Find the current folder being viewed
  const currentFolder = useMemo(() => {
    if (!currentViewFolderId) return null;
    return (
      folderData.folders.find((folder) => folder.id === currentViewFolderId) ||
      null
    );
  }, [currentViewFolderId, folderData.folders]);

  // Find the parent folder of the current folder
  const parentFolder = useMemo(() => {
    if (!currentFolder || !currentFolder.parentId) return null;
    return (
      folderData.folders.find(
        (folder) => folder.id === currentFolder.parentId,
      ) || null
    );
  }, [currentFolder, folderData.folders]);

  // Get all folders that are children of the current view folder
  const childFolders = useMemo(
    () =>
      folderData.folders
        .filter((folder) => folder.parentId === currentViewFolderId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [currentViewFolderId, folderData.folders],
  );

  // Check if a folder has children
  const folderHasChildren = (folderId: string): boolean =>
    folderData.folders.some((folder) => folder.parentId === folderId);

  // Handle folder selection
  const handleFolderClick = (folderId: string) => {
    // If clicking the currently selected folder
    if (selectedFolderId === folderId) {
      // If the folder has children, navigate into it
      if (folderHasChildren(folderId)) {
        setCurrentViewFolderId(folderId);
      } else {
        // If no children, unselect it and select the parent
        setSelectedFolderId(currentViewFolderId);
        if (onFolderSelect) {
          onFolderSelect(currentViewFolderId);
        }
      }
    } else {
      // Selecting a different folder
      setSelectedFolderId(folderId);
      if (onFolderSelect) {
        onFolderSelect(folderId);
      }

      // If the folder has children, navigate into it
      if (folderHasChildren(folderId)) {
        setCurrentViewFolderId(folderId);
      }
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    if (parentFolder) {
      setCurrentViewFolderId(parentFolder.parentId);
      setSelectedFolderId(parentFolder.id);
      if (onFolderSelect) {
        onFolderSelect(parentFolder.id);
      }
    } else {
      // If no parent folder, go to root
      setCurrentViewFolderId(null);
      if (selectedFolderId === currentViewFolderId) {
        setSelectedFolderId(null);
        if (onFolderSelect) {
          onFolderSelect(null);
        }
      }
    }
  };

  // Initialize component with root folders
  useEffect(() => {
    if (initialSelectedFolderId) {
      // Find the selected folder's parent to set the current view
      const selectedFolder = folderData.folders.find(
        (folder) => folder.id === initialSelectedFolderId,
      );

      if (selectedFolder) {
        setCurrentViewFolderId(selectedFolder.parentId);
      }
    }
  }, [initialSelectedFolderId, folderData.folders]);

  // Get root folders when no current view is set
  const rootFolders = useMemo(
    () =>
      folderData.folders
        .filter((folder) => folder.parentId === null)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [folderData.folders],
  );

  // Determine which folders to display
  const foldersToDisplay = currentViewFolderId ? childFolders : rootFolders;

  return (
    <SC.AsideContainer>
      <SC.CurrentFolderHeader>
        {currentViewFolderId && (
          <SC.BackButton onClick={handleBackClick}>
            ← Back to {parentFolder ? parentFolder.name : "Root"}
          </SC.BackButton>
        )}
        <SC.CurrentFolderTitle>
          {currentFolder ? currentFolder.name : "Folders"}
        </SC.CurrentFolderTitle>
      </SC.CurrentFolderHeader>

      <SC.FoldersList>
        {foldersToDisplay.map((folder) => {
          const hasChildren = folderHasChildren(folder.id);
          const isSelected = selectedFolderId === folder.id;

          return (
            <SC.FolderItem key={folder.id} isSelected={isSelected}>
              <SC.FolderButton
                isSelected={isSelected}
                onClick={() => handleFolderClick(folder.id)}
              >
                <div>
                  <SC.FolderIcon>📁</SC.FolderIcon>
                  <SC.FolderName>{folder.name}</SC.FolderName>
                </div>
                {hasChildren && <SC.ChevronIcon>→</SC.ChevronIcon>}
              </SC.FolderButton>
            </SC.FolderItem>
          );
        })}
      </SC.FoldersList>
    </SC.AsideContainer>
  );
};

export default FolderAside;
