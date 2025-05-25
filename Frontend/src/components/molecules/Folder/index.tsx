import React, { useState } from "react";
import Card from "../Card";
import Modal from "../Modal";
import CardForm from "../CardForm";
import * as SC from "./styles";
import { FolderProps } from "./types";
import Icon from "../../atoms/Icon";

const Folder = ({
  name,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: FolderProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    cards.map(() => false),
  );

  const handleAddCard = (
    title: string,
    question: string,
    answer: string,
    tags: string[],
  ) => {
    onAddCard(name, title, question, answer, tags);
    setIsAdding(false);
  };

  const handleFlip = (index: number) => {
    setFlippedCards(
      flippedCards.map((flipped, i) => (i === index ? !flipped : flipped)),
    );
  };

  return (
    <SC.FolderContainer>
      <SC.FolderHeader>
        <SC.FolderTitle>{name}</SC.FolderTitle>
        <SC.AddButton onClick={() => setIsAdding(true)}>
          <Icon size="s" color="textPrimary">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
              >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
            </Icon>
        </SC.AddButton>
      </SC.FolderHeader>
      <SC.CardList>
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            question={card.question}
            answer={card.answer}
            tags={card.tags}
            onEdit={(newTitle, newQuestion, newAnswer, newTags) =>
              onEditCard(name, index, newTitle, newQuestion, newAnswer, newTags)
            }
            onDelete={() => onDeleteCard(name, index)}
            isFlipped={flippedCards[index]}
            onFlip={() => handleFlip(index)}
          />
        ))}
      </SC.CardList>
      {isAdding && (
        <Modal isOpen={isAdding} onClose={() => setIsAdding(false)}>
          <CardForm onSubmit={handleAddCard} onDelete={() => {}} />
        </Modal>
      )}
    </SC.FolderContainer>
  );
};
export default Folder;
