import React from "react";
import * as SC from "./styles";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  icon,
  disabled = false,
  onClick,
  className,
  type = "button",
  ...rest
}) => {
  return (
    <SC.Button
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type}
      {...rest}
    >
      {icon && icon}
      {children}
    </SC.Button>
  );
};

export default Button;
