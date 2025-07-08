/**
 * Lazy Imports für Performance-Optimierung
 * 
 * Diese Datei implementiert Code-Splitting für größere Komponenten,
 * die nicht sofort beim ersten Seitenaufruf benötigt werden.
 */

import { lazy } from 'react';

// Analytics-Komponenten (werden nur bei /analytics benötigt)
export const AnalyticsTemplate = lazy(() => 
  import('../components/templates/AnalyticsTemplate').then(module => ({
    default: module.default
  }))
);

// CardManager-Komponenten (werden nur bei /cards benötigt)
export const CardManagerTemplate = lazy(() => 
  import('../components/templates/CardManagerTemplate').then(module => ({
    default: module.default
  }))
);

// Learning Mode-Komponenten (werden nur bei /learn benötigt)
export const LearningModeSelection = lazy(() => 
  import('../components/organisms/LearningModeSelection').then(module => ({
    default: module.default
  }))
);

// Profile-Komponenten (werden nur bei /profile benötigt)
export const ProfileTemplate = lazy(() => 
  import('../components/templates/ProfileTemplate').then(module => ({
    default: module.default
  }))
);

// Heavy Modal-Komponenten
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
