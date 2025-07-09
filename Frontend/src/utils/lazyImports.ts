/**
 * Lazy Imports for Performance Optimization
 * 
 * Implements code-splitting for larger components that are not immediately
 * required on first page load. Improves initial bundle size and loading performance.
 *
 * Code-Splitting Strategy:
 * - Analytics components: Loaded only when accessing /analytics
 * - CardManager components: Loaded only when accessing /cards  
 * - Learning Mode: Loaded only when accessing /learn
 * - Profile components: Loaded only when accessing /profile
 * - Heavy modal components: Loaded on-demand when needed
 *
 * Benefits:
 * - Reduced initial bundle size
 * - Faster first page load
 * - Better performance on slower connections
 * - Improved user experience
 *
 * Cross-references:
 * - React.lazy(): Used for component-level code splitting
 * - Next.js dynamic imports: Alternative approach for server-side rendering
 * - Webpack: Handles the actual code splitting behind the scenes
 */

import { lazy } from 'react';

// Analytics components (only needed for /analytics route)
export const AnalyticsTemplate = lazy(() => 
  import('../components/templates/AnalyticsTemplate').then(module => ({
    default: module.default
  }))
);

// CardManager components (only needed for /cards route)
export const CardManagerTemplate = lazy(() => 
  import('../components/templates/CardManagerTemplate').then(module => ({
    default: module.default
  }))
);

// Learning Mode Template (used directly by /learn page)
export const LearningModeTemplate = lazy(() => 
  import('../components/templates/LearningModeTemplate/index').then(module => ({
    default: module.LearningModeTemplate
  }))
);

// Profile components (only needed for /profile route)
export const ProfileTemplate = lazy(() => 
  import('../components/templates/ProfileTemplate').then(module => ({
    default: module.default
  }))
);

// Heavy modal components (loaded on-demand)
export const CardForm = lazy(() => 
  import('../components/molecules/CardForm').then(module => ({
    default: module.default
  }))
);

export const FolderForm = lazy(() => 
  import('../components/molecules/FolderForm').then(module => ({
    default: module.default
  }))
);
