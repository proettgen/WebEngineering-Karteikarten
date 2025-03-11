import styled from "styled-components";
import { ThemeColors } from "./types";

export const IconWrapper = styled.div<{
  $sizeValue: string;
  $colorKey: ThemeColors;
  onClick?: () => void;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};

  svg {
    height: ${({ $sizeValue }) => $sizeValue};
    width: auto;
    fill: ${({ theme, $colorKey }) => theme[$colorKey]};
  }
`;
