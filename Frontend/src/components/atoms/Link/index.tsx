import React from "react";
import * as SC from "./styles";
import { LinkProps } from "./types";

export default function Link({ href, children }: LinkProps) {
  return (
    <SC.Link href={href}>
      {children}
    </SC.Link>
  );
}