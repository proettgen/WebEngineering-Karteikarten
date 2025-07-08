/**
 * useAuthRedirect Hook
 * 
 * Custom hook for authentication redirect logic.
 * Provides a reusable way to redirect unauthenticated users to login.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useAuthRedirect = (redirectTo: string = '/login') => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, router, redirectTo]);

  return { isLoggedIn };
};
