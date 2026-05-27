'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <img src="/nav-logo.png" alt="Lunaga Logo" className="h-10 w-auto" />
          <div className="flex gap-4">
            <a href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Login
            </a>
            <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with healthcare professionals anytime, anywhere. Book consultations, 
              manage your health records, and receive expert medical guidance online.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Get Started
              </button>
              <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">👨‍⚕️ Expert Doctors</h3>
              <p className="text-gray-600">Browse and connect with verified medical professionals across various specializations.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📅 Easy Booking</h3>
              <p className="text-gray-600">Schedule consultations at your convenience with real-time availability updates.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📋 Medical Records</h3>
              <p className="text-gray-600">Securely store and access your health records, prescriptions, and consultation notes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2026 Lunaga. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
