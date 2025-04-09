import styled, { css } from "styled-components";
import { textWeight } from "./types";
import { fontSizes } from "@/components/templates/ThemeWrapper/types";
import { ThemeColors } from "../Icon/types";

const sm = () => css`
  font-size: 0.875rem;
  line-height: 1rem;
`;

const md = () => css`
  font-size: 1.25rem;
  line-height: 1.375rem;
`;

const lg = () => css`
  font-size: 1.5rem;
  line-height: 1.625rem;
`;

const xl = () => css`
  font-size: 1.875rem;
  line-height: 2.2rem;
`;

export const Text = styled.span<{
  $size: fontSizes;
  $colorKey: ThemeColors;
  $weight: textWeight;
}>`
  margin: 0;
  color: ${({ theme, $colorKey }) => theme[$colorKey]};

  ${(props) => props.$size === "small" && sm()}
  ${(props) => props.$size === "medium" && md()}
  ${(props) => props.$size === "large" && lg()}
  ${(props) => props.$size === "xlarge" && xl()}
  ${(props) =>
    props.$weight === "bold" &&
    css`
      font-weight: bold;
    `};
  ${(props) =>
    props.$weight === "regular" &&
    css`
      font-weight: normal;
    `};
`;
