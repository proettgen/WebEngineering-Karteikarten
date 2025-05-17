import React from "react";

export interface NavBarProps {
  children?: React.ReactNode;
}

export interface NavItemProps {
  $active?: boolean;
  children?: React.ReactNode;
}
