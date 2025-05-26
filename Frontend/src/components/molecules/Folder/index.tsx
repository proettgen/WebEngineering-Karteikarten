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
  onEditFolder,
}: FolderProps & { onEditFolder?: () => void }) => {
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
        <SC.EditButtonWrapper>
          {onEditFolder && (
            <SC.EditButton onClick={onEditFolder} aria-label="Edit folder">
              <Icon size="s" color="textPrimary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </Icon>
            </SC.EditButton>
          )}
          <SC.FolderTitle>{name}</SC.FolderTitle>
        </SC.EditButtonWrapper>
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
          <CardForm
            onSubmit={handleAddCard}
            onDelete={() => {}}
            onCancel={() => setIsAdding(false)}
            />
        </Modal>
      )}
    </SC.FolderContainer>
  );
};
export default Folder;
