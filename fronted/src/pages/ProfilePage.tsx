import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserList from '../components/UserList';
import DeleteAccountButton from '../components/DeleteAccountButton';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">{user?.name}</h1>
                <p className="text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">User ID: {user?.id}</p>
              </div>
            </div>
            
            <div>
              <DeleteAccountButton />
            </div>
          </div>
        </div>

        {/* User List Component */}
        <UserList />
      </div>
    </div>
  );
};

export default ProfilePage;
