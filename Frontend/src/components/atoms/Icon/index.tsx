/*
HOW TO USE:

  <Icon size="l" color="primary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
    >
      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
    </svg>
  </Icon>
     
*/

import React from "react";
import { IconProps, IconSize } from "./types";
import * as SC from "./styles";

const sizeMap: Record<IconSize, string> = {
  s: "16px",
  m: "24px",
  l: "32px",
  xl: "48px",
};

const Icon: React.FC<IconProps> = ({
  children,
  size = "m",
  color = "textPrimary",
}) => {
  const sizeValue = sizeMap[size];

  return (
    <SC.IconWrapper sizeValue={sizeValue} colorKey={color}>
      {children}
    </SC.IconWrapper>
  );
};

export default Icon;
