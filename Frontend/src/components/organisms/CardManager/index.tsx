"use client";

import React, { useState } from "react";
import CardForm from "../../molecules/CardForm";
import CardList from "../../molecules/CardList";
import Modal from "../../molecules/Modal";
import Notification from "../../molecules/Notification";
import * as SC from "./styles";

export default function CardManager() {
  const [cards, setCards] = useState<{ title: string; question: string; answer: string; tags: string[] }[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const addCard = (title: string, question: string, answer: string, tags: string[]) => {
    setCards([...cards, { title, question, answer, tags }]);
    setNotification({ message: "Card added successfully!", type: "success" });
    setModalOpen(false);
  };

  return (
    <SC.Container>
      <SC.Header>
        <SC.Title>Card Manager</SC.Title>
        <SC.AddButton onClick={() => setModalOpen(true)}>Add Card</SC.AddButton>
      </SC.Header>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <CardList cards={cards} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <CardForm onSubmit={addCard} />
      </Modal>
    </SC.Container>
  );
}