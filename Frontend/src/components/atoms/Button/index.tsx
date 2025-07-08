import React from "react";
import * as SC from "./styles";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = React.memo(({
  $variant = "primary",
  children,
  disabled = false,
  onClick,
  type = "button",
  ...rest
}) => (
  <SC.Button
    $variant={$variant}
    disabled={disabled}
    onClick={onClick}
    type={type}
    {...rest}
  >
    {children}
  </SC.Button>
));

Button.displayName = 'Button';

export default Button;
