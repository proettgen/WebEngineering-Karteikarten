"use client";

import React, { useState, useEffect } from "react";
import * as SC from "./styles";
import { CardFormProps } from "./types";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

export default function CardForm({
  onSubmit,
  onDelete,
  initialTitle = "",
  initialQuestion = "",
  initialAnswer = "",
  initialTags = "",
}: CardFormProps) {
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
      tags.split(",").map((tag) => tag.trim())
    );
  };

  return (
    <SC.Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Textarea
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <Button type="submit" $variant="accept">
        Save Card
      </Button>
      <Button type="button" $variant="danger" onClick={onDelete}>
        Delete Card
      </Button>
    </SC.Form>
  );
}
