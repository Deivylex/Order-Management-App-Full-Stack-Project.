import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccountButton: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const success = await deleteAccount();
    
    if (success) {
      navigate('/login');
    } else {
      alert('Error deleting account. Please try again.');
    }
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        🗑️ Delete Account
      </button>
    );
  }

  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <div className="text-red-300 mb-4">
        <h3 className="font-bold text-lg">⚠️ Delete Account</h3>
        <p className="text-sm">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <p className="text-xs mt-1 text-red-400">
          User: {user?.email}
        </p>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isDeleting ? '🔄 Deleting...' : '✅ Yes, Delete'}
        </button>
        
        <button
          onClick={() => setShowConfirm(false)}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountButton;
