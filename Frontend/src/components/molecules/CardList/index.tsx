import React from "react";
import Card from "../Card";
import { CardListProps } from "./types";


export default function CardList({ cards }: CardListProps) {
  return (
    <div>
      {cards.map((card, index) => (
        <Card key={index} title={card.title} content={card.content} />
      ))}
    </div>
  );
}