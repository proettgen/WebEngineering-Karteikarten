import styled from "styled-components";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";

export const PageWrapper = styled.div<{ theme: ThemeType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 61px);
  background-color: ${({ theme }) => theme.background};
`;