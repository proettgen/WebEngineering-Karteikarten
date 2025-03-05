"use client";

import React, { useState } from "react";
import * as SC from "./styles";
import { CardFormProps } from "./types";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

export default function CardForm({ onSubmit }: CardFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleClick = (e?: React.FormEvent) => {
    handleSubmit(e as React.FormEvent);
  };

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
      <Button type="submit" variant="accept" onClick={handleClick}>
        Add Card
      </Button>
    </SC.Form>
  );
}
