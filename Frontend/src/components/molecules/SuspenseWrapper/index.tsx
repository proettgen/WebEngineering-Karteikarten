/**
 * SuspenseWrapper
 * 
 * Eine wiederverwendbare Wrapper-Komponente für React.Suspense,
 * die ein ansprechendes Loading-Interface bietet.
 */

import React, { Suspense } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '../../atoms/LoadingSpinner';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallbackText?: string;
  minHeight?: string;
}

const SuspenseContainer = styled.div<{ $minHeight?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${({ $minHeight }) => $minHeight || '200px'};
  width: 100%;
  background-color: ${({ theme }) => theme.background};
`;

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallbackText = "Loading...",
  minHeight
}) => (
  <Suspense
    fallback={
      <SuspenseContainer $minHeight={minHeight}>
        <LoadingSpinner 
          size="large" 
          text={fallbackText}
        />
      </SuspenseContainer>
    }
  >
    {children}
  </Suspense>
);

export default SuspenseWrapper;
