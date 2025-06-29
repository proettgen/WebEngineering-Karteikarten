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

// API response type for folders
type GetFoldersResponse = { status: string; data: { folders: FolderType[] } };

// CardManager component
const CardManager = () => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [cardsByFolder, setCardsByFolder] = useState<Record<string, any[]>>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ name: string; id: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load folders on mount and when search/sort params change
  const loadFolders = useCallback(async (params?: { search?: string; sortBy?: string; order?: string }) => {
    setLoading(true);
    try {
      const folderParams = {
        ...params,
        order: params?.order || "asc"
      };
      const res = await apiService.getFolders(folderParams);
      // Type assertion for API response
      const foldersData = (res as GetFoldersResponse).data.folders;
      setFolders(foldersData);

      // TODO: Load cards when selected folder changes
      // For now, don't preload all cards to avoid API errors
    } catch {
      setNotification({ message: "Error loading folders!", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

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
  }, []);

  const handleSearch = useCallback((searchValue: string) => {
    setSearchTerm(searchValue);
    const params: any = {};
    if (searchValue.trim()) {
      params.search = searchValue;
    }
    if (sortOption === "name") params.sortBy = "name";
    if (sortOption === "date") params.sortBy = "createdAt";
    if (sortOption === "lastUsed") params.sortBy = "lastOpenedAt";
    loadFolders(params);
  }, [loadFolders, sortOption]);

  const handleSort = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption);
    const params: any = {};
    if (searchTerm.trim()) {
      params.search = searchTerm;
    }
    if (newSortOption === "name") params.sortBy = "name";
    if (newSortOption === "date") params.sortBy = "createdAt";
    if (newSortOption === "lastUsed") params.sortBy = "lastOpenedAt";
    loadFolders(params);
  }, [loadFolders, searchTerm]);

  // Create or update a folder
  const handleSaveFolder = async (folderName: string) => {
    setLoading(true);
    try {
      if (editingFolder && editingFolder.id) {
        await apiService.updateFolder(editingFolder.id, { name: folderName });
        setNotification({ message: "Folder updated!", type: "success" });
      } else {
        await apiService.createFolder({ name: folderName, parentId: null });
        setNotification({ message: "Folder created!", type: "success" });
      }
      await loadFolders();
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
        await loadFolders();
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
      const folder = folders.find(f => f.name === folderName);
      if (!folder) throw new Error("Folder not found");
      await apiService.createCardInFolder(folder.id, {
        title,
        question,
        answer,
        tags,
        currentLearningLevel: 0,
        createdAt: new Date().toISOString()
      });
      setNotification({ message: "Card created!", type: "success" });
      await loadCardsForFolder(folder.id); // Reload cards for this folder
    } catch {
      setNotification({ message: "Error creating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard: FolderProps["onEditCard"] = async (folderName, cardIndex, newTitle, newQuestion, newAnswer, newTags) => {
    setLoading(true);
    try {
      const folder = folders.find(f => f.name === folderName);
      if (!folder) throw new Error("Folder not found");
      const card = cardsByFolder[folder.id]?.[cardIndex];
      if (!card) throw new Error("Card not found");
      await apiService.updateCardInFolder(folder.id, card.id, {
        title: newTitle,
        question: newQuestion,
        answer: newAnswer,
        tags: newTags
      });
      setNotification({ message: "Card updated!", type: "success" });
      await loadCardsForFolder(folder.id); // Reload cards for this folder
    } catch {
      setNotification({ message: "Error updating card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard: FolderProps["onDeleteCard"] = async (folderName, cardIndex) => {
    setLoading(true);
    try {
      const folder = folders.find(f => f.name === folderName);
      if (!folder) throw new Error("Folder not found");
      const card = cardsByFolder[folder.id]?.[cardIndex];
      if (!card) throw new Error("Card not found");
      await apiService.deleteCardInFolder(folder.id, card.id);
      setNotification({ message: "Card deleted!", type: "success" });
      await loadCardsForFolder(folder.id); // Reload cards for this folder
    } catch {
      setNotification({ message: "Error deleting card!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFolder = (index: number) => {
    setEditingFolder({ name: folders[index].name, id: folders[index].id });
    setModalOpen(true);
  };

  const handleAddFolder = useCallback(() => {
    setEditingFolder(null);
    setModalOpen(true);
  }, []);

  // Get the selected folder and its cards for display
  const selectedFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;
  const selectedFolderCards = selectedFolderId ? (cardsByFolder[selectedFolderId] || []) : [];

  return (
    <SC.ContentWrapper>
      <Aside
        folders={folders}
        selectedFolderId={selectedFolderId}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onFolderSelect={handleFolderSelect}
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
                onEditFolder={() => {
                  const index = folders.findIndex(f => f.id === selectedFolder.id);
                  handleEditFolder(index);
                }}
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
