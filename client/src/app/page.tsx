'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TermsPrivacyModal } from '@/lib/components/TermsPrivacyModal';

/**
 * Lunága Landing Page
 * 
 * Production-ready homepage showcasing:
 * - Brand identity and value proposition
 * - Key features (LunaMatch, LunaRoom, Care Timeline)
 * - Call-to-action for user onboarding
 * - Responsive design with accessibility
 * 
 * Color System:
 * - Midnight Blue (#1E3A5F): Primary brand color
 * - Soft Sky Blue (#6FAEE7): Secondary, interactive elements
 * - Moonlight White (#F7FAFC): Background
 * - Soft Mint (#8ED8C3): Accent
 * - Gentle Lavender (#C6B7FF): Accent
 * 
 * Design Principles:
 * - Calm, minimal aesthetic
 * - Soft shadows and rounded cards (12-16px)
 * - Spacious, human-centered layouts
 * - Smooth transitions and hover states
 */

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  /**
   * Redirect authenticated users to dashboard
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/nav-logo.png" alt="Lunága Logo" className="h-8 rounded-lg" />
          </div>

          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-[#1E3A5F] font-medium hover:text-[#6FAEE7] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="flex-1 bg-gradient-to-br from-[#F7FAFC] to-[#E8F4F8] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#1E3A5F] leading-tight">
              Care, Wherever You Are
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with trusted healthcare professionals, book consultations in minutes, 
              and manage your health journey all in one place.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 border-2 border-[#1E3A5F] text-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F] hover:text-white font-semibold transition-colors"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Verified Healthcare Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Secure & HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-[#1E3A5F]">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for seamless healthcare consultation
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LunaMatch Feature */}
            <div className="p-8 bg-gradient-to-br from-[#F7FAFC] to-[#E8F4F8] rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-[#8ED8C3]/20">
              <div className="w-12 h-12 bg-[#8ED8C3] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">LunaMatch</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered doctor matching finds the perfect healthcare professional 
                based on your needs, preferences, and medical history.
              </p>
            </div>

            {/* LunaRoom Feature */}
            <div className="p-8 bg-gradient-to-br from-[#F7FAFC] to-[#F0E8FF] rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-[#C6B7FF]/20">
              <div className="w-12 h-12 bg-[#C6B7FF] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">LunaRoom</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure, private consultation space with high-definition video, 
                screen sharing, and real-time medical record access.
              </p>
            </div>

            {/* Care Timeline Feature */}
            <div className="p-8 bg-gradient-to-br from-[#F7FAFC] to-[#E8F4F8] rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-[#6FAEE7]/20">
              <div className="w-12 h-12 bg-[#6FAEE7] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Care Timeline</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive medical records, prescription history, and consultation notes 
                organized chronologically for complete health visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VALUE PROPOSITION SECTION ==================== */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1E3A5F] to-[#6FAEE7]">
        <div className="max-w-5xl mx-auto text-center text-white space-y-8">
          <h2 className="text-4xl font-bold">Why Choose Lunága?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {/* Quality Care */}
            <div className="space-y-3">
              <div className="text-4xl">🏥</div>
              <h3 className="text-xl font-bold">Quality Care</h3>
              <p className="text-white/90">
                Access verified, board-certified healthcare professionals with years of experience
              </p>
            </div>

            {/* Convenient */}
            <div className="space-y-3">
              <div className="text-4xl">⏰</div>
              <h3 className="text-xl font-bold">Convenient</h3>
              <p className="text-white/90">
                Schedule consultations on your time, no waiting rooms, no commute
              </p>
            </div>

            {/* Affordable */}
            <div className="space-y-3">
              <div className="text-4xl">💰</div>
              <h3 className="text-xl font-bold">Affordable</h3>
              <p className="text-white/90">
                Transparent pricing with no hidden fees, insurance integration available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-[#1E3A5F]">
            Start Your Health Journey Today
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of patients and healthcare professionals using Lunága for better healthcare delivery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register?role=PATIENT"
              className="px-8 py-3 bg-[#8ED8C3] text-white rounded-lg hover:bg-[#6FAEE7] font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up as Patient
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#1E3A5F] linear text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/nav-logo-wt.png" alt="Lunága Logo" className="h-8 rounded-lg" />
              </div>
              <p className="text-gray-300 text-sm">
                Care, Wherever You Are
              </p>
            </div>

            {/* Company Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-gray-700 pt-8 pb-6 text-center text-gray-300 text-sm">
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setModalType('terms');
                  setIsModalOpen(true);
                }}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer underline"
                aria-label="Open Terms of Service"
              >
                Terms of Service
              </button>
              <span className="text-gray-500">•</span>
              <button
                type="button"
                onClick={() => {
                  setModalType('privacy');
                  setIsModalOpen(true);
                }}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer underline"
                aria-label="Open Privacy Policy"
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 text-sm py-0">
            <p>&copy; 2026 Lunága. All rights reserved. Care, Wherever You Are.</p>
          </div>
        </div>
      </footer>

      {/* Terms & Privacy Modal */}
      <TermsPrivacyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
      />
    </div>
  );
}
