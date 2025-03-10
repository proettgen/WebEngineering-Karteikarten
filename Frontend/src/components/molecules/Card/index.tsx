import React, { useState } from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Modal from "@/components/molecules/Modal";
import CardForm from "@/components/molecules/CardForm";

export default function Card({ title, question, answer, tags, onDelete }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [currentAnswer, setCurrentAnswer] = useState(answer);
  const [currentTags, setCurrentTags] = useState(tags);

  const handleEditSubmit = (newTitle: string, newQuestion: string, newAnswer: string, newTags: string[]) => {
    setCurrentTitle(newTitle);
    setCurrentQuestion(newQuestion);
    setCurrentAnswer(newAnswer);
    setCurrentTags(newTags);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsEditing(false);
  };

  return (
    <SC.CardContainer>
      <SC.Card $isFlipped={isFlipped}>
        <SC.CardFront>
          <SC.Title>{currentTitle}<SC.SmallText>(Question)</SC.SmallText></SC.Title>
          <SC.Question>{currentQuestion}</SC.Question>
          <SC.Tags>{currentTags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={() => setIsFlipped(true)}>Show Answer</SC.ToggleButton>
          <SC.EditButton onClick={() => setIsEditing(true)}>Edit</SC.EditButton>
        </SC.CardFront>
        <SC.CardBack>
          <SC.Title>{currentTitle} <SC.SmallText>(Answer)</SC.SmallText></SC.Title>
          <SC.Answer>{currentAnswer}</SC.Answer>
          <SC.Tags>{currentTags.join(", ")}</SC.Tags>
          <SC.ToggleButton onClick={() => setIsFlipped(false)}>Show Question</SC.ToggleButton>
          <SC.EditButton onClick={() => setIsEditing(true)}>Edit</SC.EditButton>
        </SC.CardBack>
      </SC.Card>
      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <CardForm
            onSubmit={handleEditSubmit}
            onDelete={handleDelete}
            initialTitle={currentTitle}
            initialQuestion={currentQuestion}
            initialAnswer={currentAnswer}
            initialTags={currentTags.join(", ")}
          />
        </Modal>
      )}
    </SC.CardContainer>
  );
}
