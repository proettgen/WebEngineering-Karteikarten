import React from "react";
import * as SC from "./styles";
import { CardTemplateProps } from "./types";
import Link from "../../atoms/Link";

export default function CardTemplate({ title, content }: CardTemplateProps) {
  return (
    <SC.Container>
      <SC.Header>
        <Link href="/">Home</Link>
        <Link href="/CardManagerPage">Card Manager</Link>
        <Link href="/Test">Test</Link>
      </SC.Header>
      <SC.Card>
        <SC.Title>{title}</SC.Title>
        <SC.Content>{content}</SC.Content>
      </SC.Card>
    </SC.Container>
  );
}