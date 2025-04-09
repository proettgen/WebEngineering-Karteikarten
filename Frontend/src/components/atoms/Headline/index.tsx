import React from "react";
import * as SC from "./styles";
import { IProps } from "./types";

export const Headline: React.FC<IProps> = (props) => {
  const {
    children,
    size = "md",
    color = "textPrimary",
    weight = "regular",
    compact = false,
    tag = "h1",
  } = props;

  return (
    <SC.Headline
      $size={size}
      $colorKey={color}
      $weight={weight}
      $compact={compact}
      as={tag}
      data-size={size}
    >
      {children}
    </SC.Headline>
  );
};
