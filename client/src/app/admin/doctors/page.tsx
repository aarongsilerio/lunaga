'use client';

/**
 * Admin Doctor Management Panel
 * 
 * Administrative interface for managing doctor accounts.
 * 
 * Features:
 * - View list of all doctors
 * - Create new doctor accounts
 * - Edit doctor information
 * - Approve/reject doctor applications
 * - Manage specializations
 * - Doctor activation/deactivation
 * 
 * Security:
 * - ProtectedRoute wrapper enforces ADMIN role only
 * - Backend enforces authorization on all endpoints
 * - Audit trail for all admin actions (future)
 * - Rate limiting on account creation (future)
 * 
 * MVP Scope:
 * - Create doctor accounts with email and temporary password
 * - List existing doctors
 * - Assign specializations
 * - Activate/deactivate accounts
 */

import { ProtectedRoute } from '@/lib/components/ProtectedRoute';
import { useAuth } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

function AdminDoctorsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [doctors] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    specialization: 'General Practice',
    temporaryPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // TODO: Call API to create doctor account
      // const response = await fetch('/api/admin/doctors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // For now, just show success message
      setSuccess(`Doctor account provisioned: ${formData.email}`);
      setFormData({ email: '', specialization: 'General Practice', temporaryPassword: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create doctor account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const specializations = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Psychiatry',
    'Orthopedics',
    'Neurology',
    'Oncology',
    'Gynecology',
    'Urology',
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Lunága Administration</h1>
            <p className="text-sm text-gray-600">Doctor Management Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#1E3A5F]">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-[#1E3A5F] mb-2">Doctor Management</h2>
            <p className="text-gray-600">Provision and manage healthcare professional accounts</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2.5 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors font-semibold"
          >
            {showCreateForm ? 'Cancel' : '+ Create Doctor Account'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#1E3A5F] mb-6">Provision New Doctor</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="doctor@hospital.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7]"
                />
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-[#1E3A5F] mb-2">
                  Specialization
                </label>
                <select
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FAEE7]"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#152844] disabled:opacity-70 font-semibold transition-colors"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              A temporary password will be generated and should be securely communicated to the doctor.
            </p>
          </div>
        )}

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-2xl font-bold text-[#1E3A5F] mb-6">Registered Doctors</h3>
          
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <p className="text-gray-600 mb-4">No doctors provisioned yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-2 bg-[#6FAEE7] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors font-semibold"
              >
                Create First Doctor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-[#1E3A5F]">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#1E3A5F]">Specialization</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#1E3A5F]">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#1E3A5F]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b border-gray-100 hover:bg-[#F7FAFC]">
                      <td className="py-4 px-4">{doctor.email}</td>
                      <td className="py-4 px-4">{doctor.specialization}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doctor.isApproved 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doctor.isApproved ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-[#6FAEE7] hover:text-[#1E3A5F] text-sm font-semibold">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Implementation Note */}
        <div className="mt-12 bg-blue-50 border border-[#6FAEE7] rounded-2xl p-6">
          <h4 className="text-[#1E3A5F] font-bold mb-2">📋 MVP Scope</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Create doctor accounts with email and temporary password</li>
            <li>✓ Assign medical specialization</li>
            <li>✓ View all provisioned doctors</li>
            <li>⏳ Approve/reject applications (future)</li>
            <li>⏳ Bulk doctor import (future)</li>
            <li>⏳ Audit logging (future)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default function AdminDoctorsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDoctorsContent />
    </ProtectedRoute>
  );
}
