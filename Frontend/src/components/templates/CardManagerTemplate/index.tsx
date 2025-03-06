"use client";

import React from "react";
import CardManager from "../../organisms/CardManager";
import * as SC from "./styles";
import Link from "next/link";

export default function CardManagerTemplate() {
  return (
    <SC.Container>
      <SC.Header>
        <SC.Title>Karteikarten Verwaltung</SC.Title>
        <Link href="/">Home</Link>
        <Link href="/Test">Test</Link>
      </SC.Header>
      <CardManager />
    </SC.Container>
  );
}
