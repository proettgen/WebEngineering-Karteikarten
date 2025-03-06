import React, { useState } from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Link from "../../atoms/Link";

export default function Card({ title, question, answer, tags }: CardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <SC.Card>
      <SC.Title>
        <Link href={`/cards/${title}`}>{title}</Link>
      </SC.Title>
      <SC.Question>{question}</SC.Question>
      <SC.Tags>{tags.join(", ")}</SC.Tags>
      {showAnswer && <SC.Answer>{answer}</SC.Answer>}
      <SC.ToggleAnswerButton onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </SC.ToggleAnswerButton>
    </SC.Card>
  );
}