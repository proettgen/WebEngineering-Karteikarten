"use client";
import React from "react";
import { CardManagerTemplate } from "@/utils/lazyImports";
import SuspenseWrapper from "@/components/molecules/SuspenseWrapper";

const Cards = () => (
  <SuspenseWrapper>
    <CardManagerTemplate />
  </SuspenseWrapper>
);

export default Cards;
