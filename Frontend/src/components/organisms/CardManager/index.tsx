import React, { useState, useEffect } from "react";
import { storageService } from "@/services/storageService";
import { DatabaseData } from "@/database/dbtypes";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Icon from "../../atoms/Icon";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";
import Aside from "@/components/molecules/Aside";
import FolderForm from "@/components/molecules/FolderForm";

const CardManager = () => {
  const [folders, setFolders] = useState<DatabaseData["folders"]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ name: string; index: number } | null>(null);

  // Load data on startup
  useEffect(() => {
    const data = storageService.getData();
    setFolders(data.folders);
  }, []);

  // Save function
  const saveFolders = (newFolders: DatabaseData["folders"]) => {
    try {
      storageService.setData({ folders: newFolders });
      setFolders(newFolders);
      setNotification({
        message: "Saved successfully!",
        type: "success",
      });
    } catch {
      setNotification({ message: "Error saving folders:", type: "error" });
    }
  };

  const addCard = (
    folderName: string,
    title: string,
    question: string,
    answer: string,
    tags: string[],
  ) => {
    const newFolders = folders.map((folder) =>
      folder.name === folderName
        ? {
            ...folder,
            cards: [...folder.cards, { 
              id: crypto.randomUUID(), //this should be removed, this is a temporary fix no?
              title, 
              question, 
              answer, 
              tags, 
              boxLevel: 0 
            }],
          }
        : folder,
    );
    saveFolders(newFolders);
  };

  const editCard = (
    folderName: string,
    cardIndex: number,
    newTitle: string,
    newQuestion: string,
    newAnswer: string,
    newTags: string[],
  ) => {
    const newFolders = folders.map((folder) =>
      folder.name === folderName
        ? {
            ...folder,
            cards: folder.cards.map((card, index) =>
              index === cardIndex
                ? {
                    ...card, // Preserve existing properties including id
                    title: newTitle,
                    question: newQuestion,
                    answer: newAnswer,
                    tags: newTags,
                  }
                : card,
            ),
          }
        : folder,
    );
    saveFolders(newFolders);
  };

  const deleteCard = (folderName: string, cardIndex: number) => {
    const newFolders = folders.map((folder) =>
      folder.name === folderName
        ? {
            ...folder,
            cards: folder.cards.filter((_, index) => index !== cardIndex),
          }
        : folder,
    );
    saveFolders(newFolders);
  };

  // Handles both adding and editing a folder
  const handleSaveFolder = (folderName: string) => {
    if (editingFolder) {
      // Edit existing folder
      const newFolders = folders.map((folder, idx) =>
        idx === editingFolder.index ? { ...folder, name: folderName } : folder
      );
      saveFolders(newFolders);
      setEditingFolder(null);
    } else {
      // Add new folder
      const newFolders = [
        ...folders,
        {
          id: crypto.randomUUID(),
          name: folderName,
          cards: [],
        },
      ];
      saveFolders(newFolders);
    }
    setModalOpen(false);
  };

  const handleEditFolder = (index: number) => {
    setEditingFolder({ name: folders[index].name, index });
    setModalOpen(true);
  };

  const handleDeleteFolder = () => {
    if (editingFolder) {
      const newFolders = folders.filter((_, idx) => idx !== editingFolder.index);
      saveFolders(newFolders);
      setEditingFolder(null);
      setModalOpen(false);
    }
  };

  return (
    <SC.ContentWrapper>
      <Aside />
      <SC.CardsWrapper>
        <SC.Title>Folder Aside</SC.Title>
        <SC.AddButtonWrapper>
          <SC.AddButton onClick={() => { setEditingFolder(null); setModalOpen(true); }}>
            <Icon size="s" color="textPrimary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z" />
              </svg>
            </Icon>
          </SC.AddButton>
        </SC.AddButtonWrapper>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
        {folders.map((folder, index) => (
          <Folder
            key={index}
            name={folder.name}
            cards={folder.cards}
            onAddCard={addCard}
            onEditCard={editCard}
            onDeleteCard={deleteCard}
            onEditFolder={() => handleEditFolder(index)}
          />
        ))}
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
