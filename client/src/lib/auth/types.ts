/**
 * Authentication Types
 * Defines all TypeScript interfaces and types for the auth system
 */

/**
 * User role enum matching backend
 */
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

/**
 * Represents an authenticated user
 */
export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Request payload for user registration
 */
export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Request payload for user login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response from authentication endpoints (login/register)
 */
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

/**
 * Generic API error response
 */
export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}

/**
 * Auth context state
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
