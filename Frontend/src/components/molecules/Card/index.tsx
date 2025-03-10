import React, { useState } from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Modal from "@/components/molecules/Modal";
import CardForm from "@/components/molecules/CardForm";

export default function Card({ title, question, answer, tags, onEdit, onDelete }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (newTitle: string, newQuestion: string, newAnswer: string, newTags: string[]) => {
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

  return (
    <SC.CardContainer>
      <SC.Card $isFlipped={isFlipped}>
        <SC.CardFront>
          <SC.Title>{title}<SC.SmallText>(Question)</SC.SmallText></SC.Title>
          <SC.Question>{question}</SC.Question>
          <SC.Tags>{tags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={() => setIsFlipped(true)}>Show Answer</SC.ToggleButton>
          <SC.EditButton onClick={() => setIsEditing(true)}>Edit</SC.EditButton>
        </SC.CardFront>
        <SC.CardBack>
          <SC.Title>{title} <SC.SmallText>(Answer)</SC.SmallText></SC.Title>
          <SC.Answer>{answer}</SC.Answer>
          <SC.Tags>{tags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={() => setIsFlipped(false)}>Show Question</SC.ToggleButton>
          <SC.EditButton onClick={() => setIsEditing(true)}>Edit</SC.EditButton>
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
}
