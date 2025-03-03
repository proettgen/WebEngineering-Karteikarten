import React from "react";
import * as SC from "./styles";
import { LogoProps } from "./types";

export default function Logo({ src, alt }: LogoProps) {
  return (
    <SC.Logo src={src} alt={alt} />
  );
}