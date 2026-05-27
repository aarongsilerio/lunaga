'use client';

/**
 * Login Page
 * User authentication form for existing users
 * Handles email/password validation and login submission
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Validate email format
   */
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setLocalError('Password is required');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await login(email.trim(), password);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7FAFC] via-[#F7FAFC] to-[#6FAEE7]/10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Lunága</h1>
          <p className="text-[#6FAEE7]">Care, Wherever You Are</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1E3A5F] mb-6 text-center">
            Welcome Back
          </h2>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                We couldn't log you in. {displayError}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1E3A5F] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E3A5F] hover:bg-[#152844] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <div className="px-3 text-sm text-gray-500">or</div>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
