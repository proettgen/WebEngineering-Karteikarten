import styled, { css } from "styled-components";
import { HeadlineSize, HeadlineWeight } from "./types";
import { ThemeColors } from "../Icon/types";

const xs = (compact: boolean) => css`
  font-size: 0.875rem;
  line-height: ${compact ? 1 : 1.25}rem;
`;

const sm = (compact: boolean) => css`
  font-size: 1.25rem;
  line-height: ${compact ? 1.375 : 1.625}rem;
`;

const md = (compact: boolean) => css`
  font-size: 1.5rem;
  line-height: ${compact ? 1.625 : 1.875}rem;
`;

const lg = (compact: boolean) => css`
  font-size: 1.875rem;
  line-height: ${compact ? 2.25 : 2.5}rem;
`;

const xl = (compact: boolean) => css`
  font-size: 2.375rem;
  line-height: ${compact ? 2.625 : 2.875}rem;
`;

const xxl = (compact: boolean) => css`
  font-size: 3.5rem;
  line-height: ${compact ? 4 : 4.25}rem;
`;

export const Headline = styled.h1<{
  $size: HeadlineSize;
  $colorKey: ThemeColors;
  $weight: HeadlineWeight;
  $compact: boolean;
}>`
  margin: 0;
  color: ${({ theme, $colorKey }) => theme[$colorKey]};

  ${(props) => props.$size === "xs" && xs(props.$compact)}
  ${(props) => props.$size === "sm" && sm(props.$compact)}
  ${(props) => props.$size === "md" && md(props.$compact)}
  ${(props) => props.$size === "lg" && lg(props.$compact)}
  ${(props) => props.$size === "xl" && xl(props.$compact)}
  ${(props) => props.$size === "xxl" && xxl(props.$compact)}
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
