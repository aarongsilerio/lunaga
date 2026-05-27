'use client';

/**
 * Registration Page
 * New user sign-up with role selection (Patient or Doctor)
 * Handles form validation and account creation
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hooks';
import { UserRole } from '@/lib/auth/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
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

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setLocalError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setLocalError('Password must contain at least one number');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (!role) {
      setLocalError('Please select a role');
      return;
    }

    try {
      await register(email.trim(), password, role);
      // Redirect to dashboard after successful registration
      router.push('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
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

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-[#1E3A5F] mb-2 text-center">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Join Lunága and take control of your healthcare
          </p>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{displayError}</p>
            </div>
          )}

          {/* Registration Form */}
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
              <p className="text-xs text-gray-500 mb-2">
                At least 8 characters, 1 uppercase letter, and 1 number
              </p>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Create a strong password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#1E3A5F] mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1E3A5F] mb-3">
                I am a...
              </label>
              <div className="space-y-2">
                {/* Patient Option */}
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-[#F7FAFC] transition-all">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.PATIENT}
                    checked={role === UserRole.PATIENT}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isLoading}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Patient</p>
                    <p className="text-xs text-gray-500">
                      Looking to book appointments and consult with doctors
                    </p>
                  </div>
                </label>

                {/* Doctor Option */}
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-[#F7FAFC] transition-all">
                  <input
                    type="radio"
                    name="role"
                    value={UserRole.DOCTOR}
                    checked={role === UserRole.DOCTOR}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isLoading}
                    className="mr-3 w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-[#1E3A5F]">Doctor</p>
                    <p className="text-xs text-gray-500">
                      Offering medical consultations and managing patient appointments
                    </p>
                  </div>
                </label>
              </div>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <div className="px-3 text-sm text-gray-500">or</div>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#6FAEE7] hover:text-[#1E3A5F] font-semibold transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
