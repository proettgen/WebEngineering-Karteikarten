import React, { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Icon from "../../atoms/Icon";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";
import Aside from "@/components/molecules/Aside";
import FolderForm from "@/components/molecules/FolderForm";
import { Folder as FolderType } from "@/database/folderTypes";
import { FolderProps } from "../../molecules/Folder/types";

// API response type for folders
type GetFoldersResponse = { status: string; data: { folders: FolderType[] } };

// CardManager component
const CardManager = () => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [cardsByFolder, setCardsByFolder] = useState<Record<string, any[]>>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ name: string; id: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  // Loads all folders and their cards
  const loadFolders = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFolders();
      // Type assertion for API response
      const foldersData = (res as GetFoldersResponse).data.folders;
      setFolders(foldersData);

      // Optionally, load cards for each folder
      const cardsMap: Record<string, any[]> = {};
      for (const folder of foldersData) {
        const cardsRes = await apiService.getCardsByFolder(folder.id);
        cardsMap[folder.id] = (cardsRes as any).data.cards || [];
      }
      setCardsByFolder(cardsMap);
    } catch {
      setNotification({ message: "Error loading folders!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
      await apiService.createCard({
        title,
        question,
        answer,
        tags,
        folderId: folder.id,
        currentLearningLevel: 0,
        createdAt: new Date().toISOString()
      });
      setNotification({ message: "Card created!", type: "success" });
      await loadFolders();
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
      await apiService.updateCard(card.id, {
        title: newTitle,
        question: newQuestion,
        answer: newAnswer,
        tags: newTags
      });
      setNotification({ message: "Card updated!", type: "success" });
      await loadFolders();
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
      await apiService.deleteCard(card.id);
      setNotification({ message: "Card deleted!", type: "success" });
      await loadFolders();
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

  return (
    <SC.ContentWrapper>
      <Aside />
      <SC.CardsWrapper>
        <SC.Title>Folders</SC.Title>
        <SC.AddButtonWrapper>
          <SC.AddButton onClick={() => { setEditingFolder(null); setModalOpen(true); }}>
            <Icon size="s" color="textPrimary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z" />
              </svg>
            </Icon>
          </SC.AddButton>
        </SC.AddButtonWrapper>
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          folders.map((folder, index) => (
            <Folder
              key={folder.id}
              name={folder.name}
              cards={cardsByFolder[folder.id] || []}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onEditFolder={() => handleEditFolder(index)}
            />
          ))
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
