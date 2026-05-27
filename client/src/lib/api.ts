/**
 * API Client Utility
 * Handles HTTP requests to backend API with error handling
 * Automatically includes JWT token in authenticated requests
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Retrieve JWT token from localStorage
 * Used to attach to authenticated API requests
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lunaga_auth_token');
}

/**
 * Generic fetch wrapper for API requests
 * @template T Response data type
 * @param endpoint API endpoint path (e.g., '/auth/login')
 * @param options Fetch options (method, body, headers, etc.)
 * @returns Parsed API response
 * @throws Error with message describing what went wrong
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge custom headers from options
  if (options?.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.assign(headers, customHeaders);
  }

  // Attach JWT token to Authorization header if available
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Try to parse response as JSON
    let data: any;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, create error message from status
      data = null;
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage =
        data?.message ||
        `API Error: ${response.status} ${response.statusText}`;
      
      const error = new Error(errorMessage);
      (error as any).statusCode = response.status;
      throw error;
    }

    return data as T;
  } catch (error) {
    // Re-throw or wrap errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Check if error response is unauthorized (401)
 * Useful for detecting expired tokens
 */
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof Error && (error as any).statusCode === 401;
}