import React, { useState, useEffect } from "react";
import { storageService } from "@/services/storageService";
import { DatabaseData } from "@/database/dbtypes";
import Folder from "../../molecules/Folder";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";

const CardManager = () => {
  const [folders, setFolders] = useState<DatabaseData["folders"]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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
    } catch (error) {
      console.error("Error saving folders:", error);
      setNotification({ message: "Error saving folders", type: "error" });
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
            cards: [...folder.cards, { title, question, answer, tags }],
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

  const addFolder = (folderName: string) => {
    const newFolders = [...folders, { name: folderName, cards: [] }];
    saveFolders(newFolders);
    setModalOpen(false);
  };

  return (
    <SC.Container>
      <SC.Header>
          {/* This should not be a header, a website should only have one header */}
        <SC.Title>Card Manager</SC.Title>
        <SC.AddButton onClick={() => setModalOpen(true)}>
          Add Folder
        </SC.AddButton>
      </SC.Header>
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
        />
      ))}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <h2>Add Folder</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const folderName = formData.get("folderName") as string;
              addFolder(folderName);
            }}
          >
            <input
              type="text"
              name="folderName"
              placeholder="Folder Name"
              required
            />
            <button type="submit">Add Folder</button>
          </form>
        </div>
      </Modal>
    </SC.Container>
  );
};
export default CardManager;
