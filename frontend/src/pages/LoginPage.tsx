import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SocialAuth from '../components/auth/SocialAuth';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, quickLoginAdmin, quickLoginGuest, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setError('');
    const success = await login(credentials);
    
    if (success) {
      // Small delay to ensure auth context is updated
      setTimeout(() => {
        navigate('/my-bookings');
      }, 100);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleQuickAdminLogin = async () => {
    setError('');
    const success = await quickLoginAdmin();
    
    if (success) {
      // Small delay to ensure auth context is updated
      setTimeout(() => {
        navigate('/my-bookings');
      }, 100);
    } else {
      setError('Admin login failed. Please try again.');
    }
  };

  const handleQuickGuestLogin = async () => {
    setError('');
    const success = await quickLoginGuest();
    
    if (success) {
      // Small delay to ensure auth context is updated
      setTimeout(() => {
        navigate('/my-bookings');
      }, 100);
    } else {
      setError('Guest login failed. Please try again.');
    }
  };

  return (
    <AuthLayout>      
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      )}
      
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      <SocialAuth isLoading={isLoading} />
      
      {/* Quick Access Buttons */}
      <div className="mt-6 space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">Quick Access for Testing</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleQuickAdminLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 border border-slate-600 rounded-lg shadow-sm bg-slate-700 text-sm font-medium text-slate-100 hover:bg-slate-600 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <span className="mr-2">👨‍💼</span>
            Admin Access
          </button>
          
          <button
            onClick={handleQuickGuestLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-sm font-medium text-gray-100 hover:bg-gray-600 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <span className="mr-2">👤</span>
            Guest Access
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className={`font-medium text-slate-300 hover:text-white transition-colors ${
              isLoading ? 'pointer-events-none opacity-75' : ''
            }`}
            aria-label="Register new account"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;