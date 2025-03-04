"use client";

import React, { useState } from "react";
import * as SC from "./styles";
import { CardFormProps } from "./types";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Textarea from "../../atoms/Textarea";

export default function CardForm({ onSubmit }: CardFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    setTitle("");
    setContent("");
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
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button label="Add Card" onClick={handleSubmit} />
    </SC.Form>
  );
}