import styled from "styled-components";
import { ThemeColors, CursorType } from "./types";

export const IconWrapper = styled.div<{
  $sizeValue: string;
  $colorKey: ThemeColors;
  onClick?: () => void;
  $cursorStyle: CursorType; 
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $cursorStyle }) => $cursorStyle};

  svg {
    height: ${({ $sizeValue }) => $sizeValue};
    width: auto;
    fill: ${({ theme, $colorKey }) => theme[$colorKey]};
  }
`;
