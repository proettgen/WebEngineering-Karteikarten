import React from "react";

export interface TextareaProps {
  placeholder: string;
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
