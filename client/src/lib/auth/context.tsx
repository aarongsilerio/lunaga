'use client';

/**
 * Authentication Context Provider
 * Manages global authentication state and provides auth methods to components
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthContextType, UserRole } from './types';
import {
  login as loginAPI,
  register as registerAPI,
  logout as logoutAPI,
  getStoredToken,
  getStoredUser,
} from './client';

/**
 * Create auth context with default undefined value
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * Wraps application with authentication context
 * Manages user state, loading states, and error handling
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state on component mount
   * Check localStorage for existing token and user data
   */
  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  /**
   * Handle user login
   * @param email User email
   * @param password User password
   * @throws Error if login fails
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginAPI({ email, password });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle user registration
   * @param email User email
   * @param password User password
   * @param role User role (PATIENT or DOCTOR)
   * @throws Error if registration fails
   */
  const register = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await registerAPI({ email, password, role });

        if (!response.success) {
          throw new Error(response.message || 'Registration failed');
        }

        setUser(response.user);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Handle user logout
   */
  const logout = useCallback(() => {
    logoutAPI();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
