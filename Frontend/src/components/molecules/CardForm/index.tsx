"use client";

import React, { useState } from "react";
import * as SC from "./styles";
import { CardFormProps } from "./types";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

export default function CardForm({ onSubmit }: CardFormProps) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, question, answer, tags.split(",").map(tag => tag.trim()));
    setTitle("");
    setQuestion("");
    setAnswer("");
    setTags("");
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
      <Button type="submit" variant="accept">
        Add Card
      </Button>
    </SC.Form>
  );
}