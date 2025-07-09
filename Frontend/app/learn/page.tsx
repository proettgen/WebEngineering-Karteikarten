/**
 * Einstiegspunkt für die Lernmodus-Seite (/learn).
 *
 * Diese Datei ist die Page-Komponente für Next.js und wird beim Aufruf von /learn geladen.
 * Sie bindet das LearningModeTemplate direkt ein, entsprechend der Architektur-Hierarchie:
 * pages -> templates -> organisms -> molecules -> atoms
 * 
 * Features:
 * - Authentication protection (redirects to login if not authenticated)
 * - Direct template integration following proper architecture
 * - Consistent with other protected pages (/analytics, /cards)
 *
 * Das Template verwaltet die gesamte Lernmodus-Logik über die useLearningMode Hook.
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
