import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SocialAuth from '../components/auth/SocialAuth';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setError('');
    const success = await login(credentials);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex justify-center">
        <div className="bg-slate-700 border-2 border-slate-600 rounded-xl w-16 h-16 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-200">🌍</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
          <div className="text-red-300 text-sm">{error}</div>
        </div>
      )}
      
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      <SocialAuth isLoading={isLoading} />
      
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