import React from "react";
import * as SC from "./styles";
import { LinkProps } from "./types";

const Link: React.FC<LinkProps> = ({
  href,
  children,
  color = "textPrimary",
  size = "medium",
  openNewTab = false,
  underlineOnHover = false,
  ...props
}) => (
  <SC.StyledLink 
    color={color} 
    size={size} 
    href={href} 
    $underlineOnHover={underlineOnHover}
    {...props}
    {...(openNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {children}
  </SC.StyledLink>
);

export default Link;
