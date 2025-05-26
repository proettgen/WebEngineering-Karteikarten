import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import { CardFormProps } from "./types";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Text from "@/components/atoms/Text";

const CardForm = ({
  onSubmit,
  onDelete,
  onCancel,
  initialTitle = "",
  initialQuestion = "",
  initialAnswer = "",
  initialTags = "",
}: CardFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [tags, setTags] = useState(initialTags);

  useEffect(() => {
    setTitle(initialTitle);
    setQuestion(initialQuestion);
    setAnswer(initialAnswer);
    setTags(initialTags);
  }, [initialTitle, initialQuestion, initialAnswer, initialTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      title,
      question,
      answer,
      tags.split(",").map((tag) => tag.trim()),
    );
  };

  return (
    <SC.Form onSubmit={handleSubmit}>
      <Text size="medium" weight="bold" color="textPrimary">
        Card Details
      </Text>
      <SC.FieldWrapper>
        <Text size="medium" weight="regular" color="textPrimary">
          Title
        </Text>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </SC.FieldWrapper>
      <SC.FieldWrapper>
        <Text size="medium" weight="regular" color="textPrimary">
          Question
        </Text>
        <Textarea
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </SC.FieldWrapper>
      <SC.FieldWrapper>
        <Text size="medium" weight="regular" color="textPrimary">
          Answer
        </Text>
        <Textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </SC.FieldWrapper>
      <SC.FieldWrapper>
        <Text size="medium" weight="regular" color="textPrimary">
          Tags (comma separated)
        </Text>
        <Input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </SC.FieldWrapper>
      <SC.ButtonRow>
        <Button type="submit" $variant="accept">
          Save
        </Button>
        <Button type="button" $variant="deny" onClick={onDelete}>
          Delete
        </Button>
        <Button $variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </SC.ButtonRow>
    </SC.Form>
  );
};
export default CardForm;
