/**
 * SuspenseWrapper Molecule Component
 * 
 * A reusable wrapper component for React.Suspense that provides a consistent 
 * loading interface across the application. Used with lazy-loaded components 
 * to show loading states during code splitting.
 * 
 * Features:
 * - Standardized loading UI using LoadingSpinner
 * - Customizable fallback text and minimum height
 * - Consistent with the design system
 * - Theme-aware styling
 * 
 * Cross-references:
 * - src/utils/lazyImports.ts: Used with lazy-loaded components
 * - src/components/atoms/LoadingSpinner: Loading UI component
 */

import React, { Suspense } from 'react';
import LoadingSpinner from '../../atoms/LoadingSpinner';
import { SuspenseContainer } from './styles';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallbackText?: string;
  minHeight?: string;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = React.memo(({
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
));

SuspenseWrapper.displayName = 'SuspenseWrapper';

export default SuspenseWrapper;
