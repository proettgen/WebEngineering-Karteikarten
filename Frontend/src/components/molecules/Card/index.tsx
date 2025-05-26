import React, { useState } from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Modal from "@/components/molecules/Modal";
import CardForm from "@/components/molecules/CardForm";
import Text from "@/components/atoms/Text";
import Icon from "@/components/atoms/Icon";

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
          <SC.FlipButtonWrapper>
            <SC.FlipButton onClick={handleFlip} aria-label="Flip card">
              <Icon size="s" color="textPrimary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  <path d="M496-182 183-496q-11-11-17-25t-6-29q0-15 6-29t17-25l173-173q11-11 25-16.5t29-5.5q15 0 29 5.5t25 16.5l313 313q11 11 17 25t6 29q0 15-6 29t-17 25L604-182q-11 11-25 16.5t-29 5.5q-15 0-29-5.5T496-182Zm54-58 170-170-310-310-170 170 310 310ZM480 0q-99 0-186.5-37.5t-153-103Q75-206 37.5-293.5T0-480h80q0 71 24 136t66.5 117Q213-175 272-138.5T401-87L296-192l56-56L588-12q-26 6-53.5 9T480 0Zm400-480q0-71-24-136t-66.5-117Q747-785 688-821.5T559-873l105 105-56 56-236-236q26-6 53.5-9t54.5-3q99 0 186.5 37.5t153 103q65.5 65.5 103 153T960-480h-80Zm-400 0Zm-107-76q13 0 21.5-9t8.5-21q0-13-8.5-21.5T373-616q-12 0-21 8.5t-9 21.5q0 12 9 21t21 9Z" />
                </svg>
              </Icon>
            </SC.FlipButton>
          </SC.FlipButtonWrapper>
          <SC.TitleWrapper>
            <Text size="medium" color="textPrimary">
              {title}
            </Text>
          </SC.TitleWrapper>
          <SC.SectionTitleWrapper>
            <Text size="small" color="textSecondary" weight="bold">
              Question
            </Text>
          </SC.SectionTitleWrapper>
          <SC.MainTextWrapper>
            <Text size="large" weight="bold" color="textPrimary">
              {question}
            </Text>
          </SC.MainTextWrapper>
          {showEditButton && (
            <SC.EditButtonWrapper>
              <SC.EditButton onClick={() => setIsEditing(true)} aria-label="Edit card">
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
            </SC.EditButtonWrapper>
          )}
        </SC.CardFront>
        <SC.CardBack>
          <SC.FlipButtonWrapper>
            <SC.FlipButton onClick={handleFlip} aria-label="Flip card">
              <Icon size="s" color="textPrimary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  <path d="M496-182 183-496q-11-11-17-25t-6-29q0-15 6-29t17-25l173-173q11-11 25-16.5t29-5.5q15 0 29 5.5t25 16.5l313 313q11 11 17 25t6 29q0 15-6 29t-17 25L604-182q-11 11-25 16.5t-29 5.5q-15 0-29-5.5T496-182Zm54-58 170-170-310-310-170 170 310 310ZM480 0q-99 0-186.5-37.5t-153-103Q75-206 37.5-293.5T0-480h80q0 71 24 136t66.5 117Q213-175 272-138.5T401-87L296-192l56-56L588-12q-26 6-53.5 9T480 0Zm400-480q0-71-24-136t-66.5-117Q747-785 688-821.5T559-873l105 105-56 56-236-236q26-6 53.5-9t54.5-3q99 0 186.5 37.5t153 103q65.5 65.5 103 153T960-480h-80Zm-400 0Zm-107-76q13 0 21.5-9t8.5-21q0-13-8.5-21.5T373-616q-12 0-21 8.5t-9 21.5q0 12 9 21t21 9Z" />
                </svg>
              </Icon>
            </SC.FlipButton>
          </SC.FlipButtonWrapper>
          <SC.TitleWrapper>
            <Text size="medium" color="textPrimary">
              {title}
            </Text>
          </SC.TitleWrapper>
          <SC.SectionTitleWrapper>
            <Text size="small" color="textSecondary" weight="bold">
              Answer
            </Text>
          </SC.SectionTitleWrapper>
          <SC.MainTextWrapper>
            <Text size="large" weight="bold" color="textPrimary">
              {answer}
            </Text>
          </SC.MainTextWrapper>
          {showEditButton && (
            <SC.EditButtonWrapper>
              <SC.EditButton onClick={() => setIsEditing(true)} aria-label="Edit card">
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
            </SC.EditButtonWrapper>
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
            onCancel={() => setIsEditing(false)}
          />
        </Modal>
      )}
    </SC.CardContainer>
  );
};
export default Card;
