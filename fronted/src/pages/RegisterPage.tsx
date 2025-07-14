import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';
import SocialAuth from '../components/auth/SocialAuth';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
  onSwitchToLogin?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string>('');

  const handleRegister = async (credentials: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    setError('');
    
    // Client-side validation
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const success = await register({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password
    });
    
    if (!success) {
      setError('Registration failed. Please try again.');
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
      
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
      <SocialAuth isLoading={isLoading} />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className={`font-medium text-slate-300 hover:text-white transition-colors ${
              isLoading ? 'pointer-events-none opacity-75' : ''
            }`}
            aria-label="Sign in to existing account"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
