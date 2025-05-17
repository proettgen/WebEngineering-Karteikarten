import React from "react";

export interface Option {
  value: string;
  label: string;
}

export interface SelectionProps {
  options: Option[];
  onChange: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
}
