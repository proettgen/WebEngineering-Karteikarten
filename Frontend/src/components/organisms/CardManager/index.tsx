import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "@/services/apiService";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";
import Aside from "@/components/molecules/Aside";
import FolderForm from "@/components/molecules/FolderForm";
import { Folder as FolderType } from "@/database/folderTypes";
import { FolderProps } from "../../molecules/Folder/types";
import { SortOption } from "@/components/atoms/SortButton/types";
import { BreadcrumbItem } from "@/components/molecules/Aside/types";

// API response types
type GetFoldersResponse = { status: string; data: { folders: FolderType[] } };

// CardManager component
const CardManager = () => {
  const [currentFolders, setCurrentFolders] = useState<FolderType[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [cardsByFolder, setCardsByFolder] = useState<Record<string, any[]>>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null); // Store the selected folder separately
  const [allFolders, setAllFolders] = useState<FolderType[]>([]); // Store all folders for reference
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ name: string; id: string | null; parentId: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load root folders on mount and when search/sort params change
  const loadRootFolders = useCallback(async () => {
    setLoading(true);
    try {
      // Use the simple approach: load all folders and filter for root folders
      const res = await apiService.getFolders();
      const allFoldersData = (res as GetFoldersResponse).data.folders;
      setAllFolders(allFoldersData); // Store all folders for reference
      const rootFolders = allFoldersData.filter(folder => folder.parentId === null);
      setCurrentFolders(rootFolders);
      setCurrentParentId(null);
      setBreadcrumb([]);
    } catch {
      setNotification({ message: "Error loading folders!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load child folders of a parent folder
  const loadChildFolders = useCallback(async (parentId: string) => {
    setLoading(true);
    try {
      // Use allFolders if available, otherwise load from API
      let allFoldersData = allFolders;
      if (allFoldersData.length === 0) {
        const res = await apiService.getFolders();
        allFoldersData = (res as GetFoldersResponse).data.folders;
        setAllFolders(allFoldersData);
      }
      
      const childFolders = allFoldersData.filter(folder => folder.parentId === parentId);
      
      setCurrentFolders(childFolders);
      setCurrentParentId(parentId);

      // Find parent folder for breadcrumb
      const parentFolder = allFoldersData.find(f => f.id === parentId);
      if (parentFolder) {
        setBreadcrumb(prevBreadcrumb => {
          // Check if this folder is already in the breadcrumb (going back)
          const existingIndex = prevBreadcrumb.findIndex(item => item.id === parentFolder.id);
          if (existingIndex >= 0) {
            // If already exists, trim the breadcrumb up to this point
            return prevBreadcrumb.slice(0, existingIndex + 1);
          }
          // Otherwise add to breadcrumb
          return [...prevBreadcrumb, { id: parentFolder.id, name: parentFolder.name }];
        });
      }
    } catch {
      setNotification({ message: "Error loading folders!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [allFolders]);

  // Load root folders on mount
  useEffect(() => {
    loadRootFolders();
  }, [loadRootFolders]);

  // Load cards for selected folder
  const loadCardsForFolder = useCallback(async (folderId: string) => {
    try {
      const cardsRes = await apiService.getCardsByFolder(folderId);
      setCardsByFolder(prev => ({
        ...prev,
        [folderId]: (cardsRes as any).data?.cards || []
      }));
    } catch {
      // No cards found for folder - that's ok
      setCardsByFolder(prev => ({
        ...prev,
        [folderId]: []
      }));
    }
  }, []);

  // Load cards when folder is selected
  useEffect(() => {
    if (selectedFolderId) {
      loadCardsForFolder(selectedFolderId);
    }
  }, [selectedFolderId, loadCardsForFolder]);

  // Handler functions for Aside component
  const handleFolderSelect = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
    
    // Find and store the selected folder from allFolders
    if (folderId && allFolders.length > 0) {
      const folder = allFolders.find(f => f.id === folderId);
      setSelectedFolder(folder || null);
      // When a folder is selected, also show its subfolders
      loadChildFolders(folderId);
    } else {
      setSelectedFolder(null);
    }
  }, [loadChildFolders, allFolders]);

  // Handler for navigating into a folder
  const handleFolderNavigate = useCallback((folderId: string) => {
    setSelectedFolderId(null); // Clear selection when navigating to new folder level
    setSelectedFolder(null); // Clear selected folder state too
    loadChildFolders(folderId);
  }, [loadChildFolders]);

  // Handler for breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback((folderId: string | null) => {
    setSelectedFolderId(null); // Clear selection when navigating via breadcrumb
    setSelectedFolder(null); // Clear selected folder state too
    if (folderId === null) {
      // Go to root level
      loadRootFolders();
    } else {
      // Go to specific folder in breadcrumb
      loadChildFolders(folderId);
    }
  }, [loadRootFolders, loadChildFolders]);

  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);
    // For now, search only filters the current level of folders
    // A more advanced implementation would search across all folders
  }, []);

  const handleSort = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption);
    // Sort is handled client-side in Aside component
  }, []);

  // Create or update a folder
  const handleSaveFolder = async (folderName: string) => {
    setLoading(true);
    try {
      if (editingFolder && editingFolder.id) {
        await apiService.updateFolder(editingFolder.id, { name: folderName });
        setNotification({ message: "Folder updated!", type: "success" });
      } else {
        // Create folder at current level (parentId is currentParentId)
        await apiService.createFolder({ name: folderName, parentId: currentParentId });
        setNotification({ message: "Folder created!", type: "success" });
      }
      // Reload the current level folders
      if (currentParentId === null) {
        await loadRootFolders();
      } else {
        await loadChildFolders(currentParentId);
      }
    } catch {
      setNotification({ message: "Error saving folder!", type: "error" });
    } finally {
      setLoading(false);
      setEditingFolder(null);
      setModalOpen(false);
    }
  };

  // Delete a folder
  const handleDeleteFolder = async () => {
    if (editingFolder && editingFolder.id) {
      setLoading(true);
      try {
        await apiService.deleteFolder(editingFolder.id);
        setNotification({ message: "Folder deleted!", type: "success" });
        // Reload the current level folders
        if (currentParentId === null) {
          await loadRootFolders();
        } else {
          await loadChildFolders(currentParentId);
        }
      } catch {
        setNotification({ message: "Error deleting folder!", type: "error" });
      } finally {
        setLoading(false);
        setEditingFolder(null);
        setModalOpen(false);
      }
    }
  };

  // Card operations
  const handleAddCard: FolderProps["onAddCard"] = async (folderName, title, question, answer, tags) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        await apiService.createCardInFolder(selectedFolderId, {
          title,
          question,
          answer,
          tags,
          currentLearningLevel: 0,
          createdAt: new Date().toISOString()
        });
        setNotification({ message: "Card created!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error creating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard: FolderProps["onEditCard"] = async (folderName, cardIndex, newTitle, newQuestion, newAnswer, newTags) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await apiService.updateCardInFolder(selectedFolderId, card.id, {
          title: newTitle,
          question: newQuestion,
          answer: newAnswer,
          tags: newTags
        });
        setNotification({ message: "Card updated!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error updating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard: FolderProps["onDeleteCard"] = async (folderName, cardIndex) => {
    setLoading(true);
    try {
      // For selected folder, use selectedFolderId directly
      if (selectedFolderId) {
        const card = cardsByFolder[selectedFolderId]?.[cardIndex];
        if (!card) throw new Error("Card not found");
        await apiService.deleteCardInFolder(selectedFolderId, card.id);
        setNotification({ message: "Card deleted!", type: "success" });
        await loadCardsForFolder(selectedFolderId); // Reload cards for this folder
      } else {
        setNotification({ message: "No folder selected!", type: "error" });
      }
    } catch {
      setNotification({ message: "Error deleting card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder({
      name: folder.name,
      id: folder.id,
      parentId: folder.parentId
    });
    setModalOpen(true);
  };

  const handleAddFolder = useCallback(() => {
    // Create a new folder at the current level
    setEditingFolder({
      name: '',
      id: null,
      parentId: currentParentId
    });
    setModalOpen(true);
  }, [currentParentId]);

  // Get the selected folder cards for display
  const selectedFolderCards = selectedFolderId ? (cardsByFolder[selectedFolderId] || []) : [];

  // Update selectedFolder when allFolders is loaded and we have a selectedFolderId
  useEffect(() => {
    if (selectedFolderId && allFolders.length > 0 && !selectedFolder) {
      const folder = allFolders.find(f => f.id === selectedFolderId);
      if (folder) {
        setSelectedFolder(folder);
      }
    }
  }, [allFolders, selectedFolderId, selectedFolder]);

  return (
    <SC.ContentWrapper>
      <Aside
        currentFolders={currentFolders}
        currentParentId={currentParentId}
        selectedFolderId={selectedFolderId}
        breadcrumb={breadcrumb}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onFolderSelect={handleFolderSelect}
        onFolderNavigate={handleFolderNavigate}
        onBreadcrumbNavigate={handleBreadcrumbNavigate}
        onSearch={handleSearch}
        onSort={handleSort}
        onAddFolder={handleAddFolder}
        loading={loading}
      />
      <SC.CardsWrapper>
        {selectedFolder ? (
          <>
            <SC.Title>{selectedFolder.name}</SC.Title>
            {notification && (
              <Notification message={notification.message} type={notification.type} />
            )}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Folder
                key={selectedFolder.id}
                name={selectedFolder.name}
                cards={selectedFolderCards}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onEditFolder={() => handleEditFolder(selectedFolder)}
              />
            )}
          </>
        ) : (
          <>
            <SC.Title>Select a Folder</SC.Title>
            {notification && (
              <Notification message={notification.message} type={notification.type} />
            )}
            <div>Please select a folder from the sidebar to view its cards.</div>
          </>
        )}
        <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setEditingFolder(null); }}>
          <FolderForm
            initialName={editingFolder?.name}
            onSave={handleSaveFolder}
            onDelete={editingFolder ? handleDeleteFolder : undefined}
            onCancel={() => { setModalOpen(false); setEditingFolder(null); }}
            isEdit={!!editingFolder}
          />
        </Modal>
      </SC.CardsWrapper>
    </SC.ContentWrapper>
  );
};

export default CardManager;