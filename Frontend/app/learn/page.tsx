/**
 * Learning Mode Page Entry Point (/learn)
 *
 * Next.js page component that loads when accessing the /learn route.
 * Integrates the LearningModeTemplate following the architectural hierarchy:
 * pages -> templates -> organisms -> molecules -> atoms
 * 
 * Features:
 * - Authentication protection (redirects to login if not authenticated)
 * - Direct template integration following proper architecture
 * - Consistent with other protected pages (/analytics, /cards)
 * - Template manages all learning mode logic via useLearningMode hook
 *
 * Architecture:
 * - Page-level component for Next.js routing
 * - Wraps LearningModeTemplate for complete learning functionality
 * - Integrates with AuthContext for user authentication
 */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import { LearningModeTemplate } from "@/utils/lazyImports";

export default function LearnPage() {
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

  return <LearningModeTemplate />;
}
