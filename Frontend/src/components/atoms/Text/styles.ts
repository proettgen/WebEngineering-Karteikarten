import styled, { css } from "styled-components";
import { textWeight } from "./types";
import { FontSizes } from "@/components/templates/ThemeWrapper/types";
import { ThemeColors } from "../Icon/types";

const sm = () => css`
  font-size: ${({ theme }) => theme.fontSizes.small};
  line-height: 1rem;
`;

const md = () => css`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.375rem;
`;

const lg = () => css`
  font-size: ${({ theme }) => theme.fontSizes.large};
  line-height: 1.625rem;
`;

const xl = () => css`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  line-height: 2.2rem;
`;

export const Text = styled.span<{
  $size: FontSizes;
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
