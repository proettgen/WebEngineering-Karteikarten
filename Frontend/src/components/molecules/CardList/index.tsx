import React from "react";
import Card from "../Card";
import * as SC from "./styles";
import { CardListProps } from "./types";

const CardList = ({ cards, onDelete }: CardListProps) => (
  <SC.CardList>
    {cards.map((card, index) => (
      <Card
        key={index}
        title={card.title}
        question={card.question}
        answer={card.answer}
        tags={card.tags}
        onDelete={() => onDelete(index)}
      />
    ))}
  </SC.CardList>
);
export default CardList;
