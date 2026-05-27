/**
 * Authentication Module Exports
 * Central export point for all auth-related utilities and types
 */

// Types
export type {
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ApiError,
  AuthContextType,
} from './types';

// Enums
export { UserRole } from './types';

// Context
export { AuthProvider, AuthContext } from './context';

// Hooks
export { useAuth, useIsAuthenticated, useCurrentUser, useIsDoctor, useIsPatient, useIsAdmin } from './hooks';

// Client functions
export {
  login,
  register,
  logout,
  isAuthenticated,
  getStoredToken,
  getStoredUser,
  storeToken,
  storeUser,
  clearToken,
} from './client';
