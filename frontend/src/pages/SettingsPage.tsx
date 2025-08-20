import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Only admin users can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">This page is only accessible to administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-2 text-gray-600">Administrative configuration panel</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Settings Panel</h2>
            <p className="text-gray-600">This section is under development.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for administrative settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
