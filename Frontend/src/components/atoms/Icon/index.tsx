import React from "react";
import * as SC from "./styles";
import { IconProps } from "./types";

export default function Icon({ name }: IconProps) {
  return (
    <SC.Icon className={`icon-${name}`} />
  );
}