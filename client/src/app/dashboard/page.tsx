'use client';

/**
 * Patient Dashboard
 * 
 * Main portal for patients after authentication.
 * 
 * Features:
 * - Role-based access (PATIENT only)
 * - Welcome with patient info
 * - Quick actions (book appointment, browse doctors)
 * - Recent consultations
 * - Medical records overview
 * - Appointments calendar
 * - Secure logout
 * 
 * Security:
 * - ProtectedRoute wrapper enforces authentication
 * - Role validation ensures patient access
 * - Automatic redirect for unauthorized users
 */

import { ProtectedRoute } from '@/lib/components/ProtectedRoute';
import { useAuth } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PatientDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <span className="text-xl font-bold text-[#1E3A5F]">Lunága</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#1E3A5F]">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1E3A5F] mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Take control of your healthcare journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#6FAEE7]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-[#1E3A5F] mt-2">0</p>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </div>

          {/* Your Doctors */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#8ED8C3]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Connected Doctors</p>
                <p className="text-3xl font-bold text-[#1E3A5F] mt-2">0</p>
              </div>
              <span className="text-3xl">👨‍⚕️</span>
            </div>
          </div>

          {/* Medical Records */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-[#C6B7FF]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Care Timeline Entries</p>
                <p className="text-3xl font-bold text-[#1E3A5F] mt-2">0</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Book Appointment */}
          <Link
            href="#"
            className="bg-gradient-to-br from-[#6FAEE7] to-[#1E3A5F] rounded-2xl shadow-md p-8 text-white text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">📆</div>
            <h3 className="text-xl font-bold mb-2">Book a Consultation</h3>
            <p className="text-white/90 text-sm">Find and schedule with a healthcare professional</p>
          </Link>

          {/* Browse Doctors */}
          <Link
            href="/doctors"
            className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">Discover Doctors</h3>
            <p className="text-gray-600 text-sm">Browse verified healthcare professionals using LunaMatch</p>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Care Timeline */}
          <button className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">📜</div>
            <h3 className="font-bold text-[#1E3A5F] mb-2">Care Timeline</h3>
            <p className="text-gray-600 text-xs">View your medical records and consultation history</p>
          </button>

          {/* Messages */}
          <button className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-[#1E3A5F] mb-2">Messages</h3>
            <p className="text-gray-600 text-xs">Communicate with your doctors between appointments</p>
          </button>

          {/* Prescriptions */}
          <button className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">💊</div>
            <h3 className="font-bold text-[#1E3A5F] mb-2">Prescriptions</h3>
            <p className="text-gray-600 text-xs">View and refill your prescriptions</p>
          </button>
        </div>

        {/* Information Banner */}
        <div className="bg-gradient-to-r from-[#F7FAFC] to-[#E8F4F8] border border-[#6FAEE7]/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">Get Started with Lunága</h3>
              <p className="text-gray-600 text-sm mb-3">
                Lunága makes healthcare more accessible. Use LunaMatch to find the perfect doctor, 
                schedule consultations in LunaRoom, and manage everything in your Care Timeline.
              </p>
              <Link
                href="/doctors"
                className="inline-block px-4 py-2 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors font-medium text-sm"
              >
                Explore Doctors
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="PATIENT">
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}
