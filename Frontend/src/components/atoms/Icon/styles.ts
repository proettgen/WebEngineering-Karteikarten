import styled from "styled-components";
import { ThemeColors } from "./types";

export const IconWrapper = styled.div<{
  sizeValue: string;
  colorKey: ThemeColors;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    height: ${({ sizeValue }) => sizeValue};
    width: auto;
    fill: ${({ theme, colorKey }) => theme[colorKey]};
  }
`;
