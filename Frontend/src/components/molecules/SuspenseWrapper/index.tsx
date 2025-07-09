/**
 * SuspenseWrapper
 * 
 * Eine wiederverwendbare Wrapper-Komponente für React.Suspense,
 * die ein ansprechendes Loading-Interface bietet.
 */

import React, { Suspense } from 'react';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import { SuspenseContainer } from './styles';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallbackText?: string;
  minHeight?: string;
}

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
