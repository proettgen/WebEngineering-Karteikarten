import React from "react";

export interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}