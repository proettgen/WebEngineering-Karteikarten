"use client";
import React from "react";
import CardManagerTemplate from "@/components/templates/CardManagerTemplate/index";
import { Suspense } from "react";

const Cards = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CardManagerTemplate />
  </Suspense>
);

export default Cards;
