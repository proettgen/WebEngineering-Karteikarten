import React, { useState } from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Modal from "@/components/molecules/Modal";
import CardForm from "@/components/molecules/CardForm";

const Card = ({
  title,
  question,
  answer,
  tags,
  onEdit,
  onDelete,
  isFlipped = false,
  onFlip,
  showEditButton = true,
}: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (
    newTitle: string,
    newQuestion: string,
    newAnswer: string,
    newTags: string[],
  ) => {
    if (onEdit) {
      onEdit(newTitle, newQuestion, newAnswer, newTags);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    }
  };

  return (
    <SC.CardContainer>
      <SC.Card $isFlipped={isFlipped}>
        <SC.CardFront>
          <SC.Title>
            {title}
            <SC.SmallText>(Question)</SC.SmallText>
          </SC.Title>
          <SC.Question>{question}</SC.Question>
          <SC.Tags>{tags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={handleFlip}>Show Answer</SC.ToggleButton>
          {showEditButton && (
            <SC.EditButton onClick={() => setIsEditing(true)}>
              Edit
            </SC.EditButton>
          )}
        </SC.CardFront>
        <SC.CardBack>
          <SC.Title>
            {title} <SC.SmallText>(Answer)</SC.SmallText>
          </SC.Title>
          <SC.Answer>{answer}</SC.Answer>
          <SC.Tags>{tags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={handleFlip}>Show Question</SC.ToggleButton>
          {showEditButton && (
            <SC.EditButton onClick={() => setIsEditing(true)}>
              Edit
            </SC.EditButton>
          )}
        </SC.CardBack>
      </SC.Card>
      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <CardForm
            onSubmit={handleEditSubmit}
            initialTitle={title}
            initialQuestion={question}
            initialAnswer={answer}
            initialTags={tags.join(", ")}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </SC.CardContainer>
  );
};
export default Card;
