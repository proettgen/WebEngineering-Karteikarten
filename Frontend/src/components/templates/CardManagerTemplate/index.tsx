"use client";

import React from "react";
import CardManager from "../../organisms/CardManager";
import * as SC from "./styles";

export default function CardManagerTemplate() {
  return (
    <SC.Container>
      <SC.Header>
        <SC.Title>Karteikarten Verwaltung</SC.Title>
      </SC.Header>
      <CardManager />
    </SC.Container>
  );
}
