import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
`;

export const Input = styled.input`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.textPrimary};
`;

export const ButtonRow = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;