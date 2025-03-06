import React from "react";
import Card from "../Card";
import * as SC from "./styles";
import { CardListProps } from "./types";

export default function CardList({ cards }: CardListProps) {
  return (
    <SC.CardList>
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          question={card.question}
          answer={card.answer}
          tags={card.tags}
        />
      ))}
    </SC.CardList>
  );
}