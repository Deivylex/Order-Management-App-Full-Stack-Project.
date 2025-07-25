import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientList from '../components/ClientList';
import DeleteAccountButton from '../components/DeleteAccountButton';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">{user?.name}</h1>
                <p className="text-gray-400">{user?.email}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-sm text-gray-500">User ID: {user?.id}</p>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-1 bg-amber-900/50 border border-amber-700 rounded text-amber-300 text-xs font-medium">
                      🔐 ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <DeleteAccountButton />
            </div>
          </div>
        </div>

        {/* Client List Component - Solo para admins */}
        <ClientList />
      </div>
    </div>
  );
};

export default ProfilePage;
