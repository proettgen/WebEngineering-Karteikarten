import styled from "styled-components";
import { ThemeType } from "@/components/templates/ThemeWrapper/types";

export const Container = styled.div<{ theme: ThemeType }>`
  background-color: ${({ theme }) => theme.surface};
  padding: 32px 40px;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const HeaderSection = styled.div`
  text-align: center;
`;

export const MessageContainer = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface}15;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border}20;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const LabelContainer = styled.div`
  min-width: 140px;
`;

export const Value = styled.div`
  flex: 1;
  text-align: right;
`;

export const Divider = styled.hr<{ theme: ThemeType }>`
  margin: 16px 0;
  border-top: 1px solid ${({ theme }) => theme.textSecondary};
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DangerZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WarningMessage = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.deny}10;
  border: 1px solid ${({ theme }) => theme.deny}30;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;