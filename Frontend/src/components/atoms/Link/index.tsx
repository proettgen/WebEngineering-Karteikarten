import React from "react";
import * as SC from "./styles";
import { LinkProps } from "./types";

const Link: React.FC<LinkProps> = ({
  href,
  children,
  color = "textPrimary",
  size = "medium",
  ...props
}) => {
  return (
    <SC.StyledLink color={color} size={size} href={href} {...props}>
      {children}
    </SC.StyledLink>
  );
};

export default Link;
