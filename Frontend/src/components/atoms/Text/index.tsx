import React from "react";
import * as SC from "./styles";
import { IProps } from "./types";

export const Text: React.FC<IProps> = (props) => {
  const {
    children,
    size = "small",
    color = "textPrimary",
    weight = "regular",
  } = props;

  return (
    <SC.Text $size={size} $colorKey={color} $weight={weight}>
      {children}
    </SC.Text>
  );
};
export default Text;
