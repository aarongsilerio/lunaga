'use client';

/**
 * Protected Route Component
 * Wraps components that require authentication
 * Redirects to login if user is not authenticated
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated, useCurrentUser } from '../auth/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'PATIENT' | 'DOCTOR';
}

/**
 * ProtectedRoute Component
 * - Redirects unauthenticated users to /login
 * - Optionally validates user role
 * 
 * @example
 * export default function DoctorDashboard() {
 *   return (
 *     <ProtectedRoute requiredRole="DOCTOR">
 *       <DoctorContent />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if user has the required role
    if (requiredRole && user && user.role !== requiredRole) {
      router.push('/login');
    }
  }, [isAuthenticated, requiredRole, user, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated || (requiredRole && user && user.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#6FAEE7] border-t-[#1E3A5F]"></div>
          <p className="mt-4 text-[#1E3A5F]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
