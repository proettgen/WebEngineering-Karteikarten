// atoms/Link/styles.ts
import styled from "styled-components";
import { StyledLinkProps } from "./types";
import Link from "next/link";

export const StyledLink = styled(Link)<StyledLinkProps>`
  color: ${({ theme, color }) => theme[color]};
  font-size: ${({ theme, size }) => theme.fontSizes[size]};
  text-decoration: none;
`;
