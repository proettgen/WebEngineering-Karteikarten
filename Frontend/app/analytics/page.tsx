
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import { AnalyticsTemplate } from "../../src/utils/lazyImports";
import SuspenseWrapper from "../../src/components/molecules/SuspenseWrapper";

/**
 * AnalyticsPage (Frontend)
 *
 * The main analytics page component following atomic design principles.
 * Now fully refactored to use custom hooks, templates, and atomic components.
 *
 * Features:
 * - Authentication protection
 * - Atomic design architecture
 * - Custom hooks for state management
 * - Template-based layout
 * - Improved error handling and loading states
 *
 * Architecture:
 * - Page Component (this file): Route-level logic and auth
 * - Template Component: Layout and component orchestration
 * - Organism Components: Complex UI sections
 * - Molecule Components: Mid-level UI components
 * - Atom Components: Basic UI elements
 * - Custom Hooks: Business logic and state management
 *
 * Cross-references:
 * - src/components/templates/AnalyticsTemplate: Main template
 * - src/hooks/useAnalytics.ts: Analytics state management
 * - src/context/AuthContext.tsx: Authentication context
 */
export default function AnalyticsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  // Authentication protection: redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Don't render anything while checking authentication
  if (isLoggedIn === null) {
    return null;
  }

  // Don't render if user is not authenticated (will redirect)
  if (isLoggedIn === false) {
    return null;
  }

  return (
    <SuspenseWrapper>
      <AnalyticsTemplate testId="analytics-page" />
    </SuspenseWrapper>
  );
}