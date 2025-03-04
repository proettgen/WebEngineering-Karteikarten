import React from "react";
import * as SC from "./styles";
import { CardProps } from "./types";
import Link from "../../atoms/Link";

export default function Card({ title, content }: CardProps) {
  return (
    <SC.Card>
      <SC.Title>
        <Link href={`/cards/${title}`}>{title}</Link>
      </SC.Title>
      <SC.Content>{content}</SC.Content>
    </SC.Card>
  );
}