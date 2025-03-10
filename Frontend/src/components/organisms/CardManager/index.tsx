"use client";

import React, { useState } from "react";
import FolderList from "../../molecules/FolderList";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";

export default function CardManager() {
  const [folders, setFolders] = useState<{ name: string; cards: { title: string; question: string; answer: string; tags: string[] }[] }[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const addCard = (folderName: string, title: string, question: string, answer: string, tags: string[]) => {
    setFolders(folders.map(folder => 
      folder.name === folderName 
        ? { ...folder, cards: [...folder.cards, { title, question, answer, tags }] } 
        : folder
    ));
    setNotification({ message: "Card added successfully!", type: "success" });
  };

  const editCard = (folderName: string, cardIndex: number, newTitle: string, newQuestion: string, newAnswer: string, newTags: string[]) => {
    setFolders(folders.map(folder => 
      folder.name === folderName 
        ? { ...folder, cards: folder.cards.map((card, index) => 
            index === cardIndex 
              ? { title: newTitle, question: newQuestion, answer: newAnswer, tags: newTags } 
              : card
          ) } 
        : folder
    ));
    setNotification({ message: "Card edited successfully!", type: "success" });
  };

  const deleteCard = (folderName: string, cardIndex: number) => {
    setFolders(folders.map(folder => 
      folder.name === folderName 
        ? { ...folder, cards: folder.cards.filter((_, index) => index !== cardIndex) } 
        : folder
    ));
    setNotification({ message: "Card deleted successfully!", type: "success" });
  };

  return (
    <SC.Container>
      <SC.Header>
        <SC.Title>Card Manager</SC.Title>
        <SC.AddButton onClick={() => setModalOpen(true)}>Add Folder</SC.AddButton>
      </SC.Header>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <FolderList folders={folders} onAddCard={addCard} onEditCard={editCard} onDeleteCard={deleteCard} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <div>
          {/* Add Folder Form */}
          <h2>Add Folder</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const folderName = formData.get("folderName") as string;
            setFolders([...folders, { name: folderName, cards: [] }]);
            setModalOpen(false);
          }}>
            <input type="text" name="folderName" placeholder="Folder Name" required />
            <button type="submit">Add Folder</button>
          </form>
        </div>
      </Modal>
    </SC.Container>
  );
}