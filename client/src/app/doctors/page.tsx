'use client';

/**
 * Doctor Discovery Page
 * 
 * Browse and search for healthcare professionals using LunaMatch.
 * Patients can discover doctors by specialization and book consultations.
 * 
 * Features:
 * - Search doctors by specialization
 * - Filter by availability
 * - View doctor profiles and credentials
 * - Book consultation from doctor card
 * - Responsive grid layout
 * - No authentication required for browsing (future: require login to book)
 * 
 * LunaMatch - AI-powered doctor matching system
 */

import { useState } from 'react';
import Link from 'next/link';

/**
 * Mock doctor data
 * TODO: Fetch from backend API
 */
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    rating: 4.8,
    consultations: 342,
    availability: 'Available',
    image: '👩‍⚕️',
    bio: 'Board-certified cardiologist with 12+ years of experience',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'General Practice',
    rating: 4.9,
    consultations: 521,
    availability: 'Available',
    image: '👨‍⚕️',
    bio: 'Primary care specialist focused on preventive medicine',
  },
  {
    id: 3,
    name: 'Dr. Emma Wilson',
    specialization: 'Dermatology',
    rating: 4.7,
    consultations: 289,
    availability: 'Available Today',
    image: '👩‍⚕️',
    bio: 'Specialized in skin conditions and aesthetic treatments',
  },
  {
    id: 4,
    name: 'Dr. James Lee',
    specialization: 'Orthopedics',
    rating: 4.6,
    consultations: 198,
    availability: 'Available',
    image: '👨‍⚕️',
    bio: 'Orthopedic surgeon specializing in sports medicine',
  },
];

const specializations = [
  'All Specializations',
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
];

export default function DoctorDiscoveryPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filter doctors based on specialization and search query
   */
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSpecialization =
      selectedSpecialization === 'All Specializations' ||
      doctor.specialization === selectedSpecialization;

    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSpecialization && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <span className="text-xl font-bold text-[#1E3A5F]">Lunága</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[#1E3A5F] hover:text-[#6FAEE7] transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">
            Discover Healthcare Professionals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and connect with verified doctors using LunaMatch AI-powered matching
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-[#1E3A5F] mb-2">
              Search Doctors
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialization..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7] transition-all"
            />
          </div>

          {/* Specialization Filter */}
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-[#1E3A5F] mb-3">
              Filter by Specialization
            </label>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedSpecialization === spec
                      ? 'bg-[#6FAEE7] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          <p>
            Showing <span className="font-semibold text-[#1E3A5F]">{filteredDoctors.length}</span> doctors
            {selectedSpecialization !== 'All Specializations' && (
              <span> in <span className="font-semibold">{selectedSpecialization}</span></span>
            )}
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                {/* Doctor Header */}
                <div className="bg-gradient-to-r from-[#6FAEE7] to-[#1E3A5F] p-6 text-white">
                  <div className="text-5xl mb-3">{doctor.image}</div>
                  <h3 className="text-xl font-bold">{doctor.name}</h3>
                  <p className="text-white/90 text-sm">{doctor.specialization}</p>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4">{doctor.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Rating</p>
                      <p className="text-lg font-bold text-[#1E3A5F]">
                        ⭐ {doctor.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Consultations</p>
                      <p className="text-lg font-bold text-[#1E3A5F]">{doctor.consultations}</p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {doctor.availability}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-2.5 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors font-semibold"
                    >
                      Book Consultation
                    </Link>
                    <button className="w-full px-4 py-2 border border-[#6FAEE7] text-[#6FAEE7] rounded-lg hover:bg-[#F7FAFC] transition-colors font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#F7FAFC] to-[#E8F4F8] border border-[#6FAEE7]/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">LunaMatch - AI Doctor Matching</h3>
              <p className="text-gray-600 text-sm">
                Our AI-powered system helps you find the perfect healthcare professional based on your needs, 
                preferences, and medical history. All doctors on our platform are verified and credentialed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
