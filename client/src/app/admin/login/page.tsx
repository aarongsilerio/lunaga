'use client';

/**
 * Admin Login Page
 * 
 * Platform administrator authentication portal.
 * Restricted access to platform administrators only.
 * 
 * Features:
 * - Email and password authentication
 * - Form validation with user feedback
 * - Loading states for better UX
 * - Secure token management
 * - Redirect to admin panel on success
 * - Clickable Terms of Service and Privacy Policy modals
 * - Links to patient and doctor portals
 * 
 * Security:
 * - Backend enforces ADMIN role
 * - Limited admin account creation (hardcoded or seeded)
 * - Token stored securely
 * - Role validation on every protected request
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import { TermsPrivacyModal } from '@/lib/components/TermsPrivacyModal';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  // Form state
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

    try {
      await login(email.trim(), password);
      // Auth context validates role - redirect happens if not ADMIN
      router.push('/admin/doctors');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
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
          <p className="text-[#6FAEE7]">Administration Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1E3A5F] mb-2 text-center">
            Admin Login
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Platform administration and doctor management
          </p>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{displayError}</p>
            </div>
          )}

          {/* Warning Alert */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-medium">
              ⚠️ This portal is restricted to platform administrators only.
            </p>
          </div>

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
                placeholder="admin@lunaga.com"
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <div className="px-3 text-sm text-gray-500">or</div>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Navigation Links */}
          <p className="text-center text-gray-600 text-sm mb-4">
            Are you a patient?{' '}
            <Link
              href="/login"
              className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors"
            >
              Patient login
            </Link>
          </p>

          <p className="text-center text-gray-600 text-sm">
            Healthcare professional?{' '}
            <Link
              href="/doctor/login"
              className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors"
            >
              Doctor login
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <button
            type="button"
            onClick={() => {
              setModalType('terms');
              setIsModalOpen(true);
            }}
            className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors cursor-pointer underline"
            aria-label="Open Terms of Service"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            onClick={() => {
              setModalType('privacy');
              setIsModalOpen(true);
            }}
            className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors cursor-pointer underline"
            aria-label="Open Privacy Policy"
          >
            Privacy Policy
          </button>
        </p>

        {/* Terms and Privacy Modal */}
        <TermsPrivacyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
        />
      </div>
    </div>
  );
}
