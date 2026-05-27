'use client';

/**
 * Authentication Hooks
 * Custom React hooks for accessing auth context and state
 */

import { useContext } from 'react';
import { AuthContext } from './context';
import type { AuthContextType } from './types';
import { UserRole } from './types';

/**
 * Hook to access authentication context
 * @returns Auth context object with user, methods, and state
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

/**
 * Hook to check if user is authenticated
 * @returns true if user is logged in
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to get current user
 * @returns Current user object or null if not authenticated
 */
export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is a doctor
 * @returns true if current user is a doctor
 */
export function useIsDoctor(): boolean {
  const user = useCurrentUser();
  return user?.role === UserRole.DOCTOR;
}

/**
 * Hook to check if user is a patient
 * @returns true if current user is a patient
 */
export function useIsPatient(): boolean {
  const user = useCurrentUser();
  return user?.role === UserRole.PATIENT;
}

/**
 * Hook to check if user is an admin
 * @returns true if current user is an admin
 */
export function useIsAdmin(): boolean {
  const user = useCurrentUser();
  return user?.role === UserRole.ADMIN;
}
