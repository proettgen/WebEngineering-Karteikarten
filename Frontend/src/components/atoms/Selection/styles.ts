import styled from 'styled-components';

export const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: #f4f4f4;
  color: #333;
  padding: 20px;
  box-sizing: border-box;
`;

export const Label = styled.label`
  margin-bottom: 10px;
`;

export const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;