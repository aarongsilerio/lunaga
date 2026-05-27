/**
 * Authentication API Client
 * Handles communication with backend auth endpoints
 * Manages JWT token storage and retrieval
 */

import { fetchAPI } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse } from './types';

const TOKEN_STORAGE_KEY = 'lunaga_auth_token';
const USER_STORAGE_KEY = 'lunaga_user';

/**
 * Retrieve stored JWT token from localStorage
 * @returns JWT token or null if not found
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Store JWT token in localStorage
 * @param token JWT token to store
 */
export function storeToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Clear stored JWT token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Store user in localStorage
 */
export function storeUser(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Register a new user
 * @param payload Registration details (email, password, role)
 * @returns User data and auth token
 * @throws Error if registration fails
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success && response.token) {
      storeToken(response.token);
      storeUser(response.user);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    throw new Error(message);
  }
}

/**
 * Login an existing user
 * @param payload Login credentials (email, password)
 * @returns User data and auth token
 * @throws Error if login fails
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success && response.token) {
      storeToken(response.token);
      storeUser(response.user);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    throw new Error(message);
  }
}

/**
 * Logout current user by clearing stored token and user data
 */
export function logout(): void {
  clearToken();
}

/**
 * Check if user is currently authenticated (has valid token)
 * @returns true if token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  return getStoredToken() !== null;
}
