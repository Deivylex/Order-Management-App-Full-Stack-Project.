import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';

interface RegisterFormProps {
  onSubmit: (credentials: { name: string; email: string; password: string; confirmPassword: string }) => void;
  isLoading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Create account</h1>
        <p className="text-gray-400 mt-2">Sign up to get started with your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={credentials.name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition placeholder-gray-500"
              placeholder="Your full name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition placeholder-gray-500"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition placeholder-gray-500"
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={credentials.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition placeholder-gray-500"
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-600 bg-gray-800 rounded"
            disabled={isLoading}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-300">
            I agree to the{' '}
            <a href="#" className="font-medium text-slate-300 hover:text-white">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-slate-300 hover:text-white">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-100 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : 'Create account'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
