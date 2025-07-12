import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaMicrosoft } from 'react-icons/fa';

interface SocialAuthProps {
  isLoading?: boolean;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ isLoading = false }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={isLoading}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          aria-label="Sign in with Google"
        >
          <FcGoogle className="h-5 w-5" />
        </button>
        
        <button
          type="button"
          disabled={isLoading}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          aria-label="Sign in with GitHub"
        >
          <FaGithub className="h-5 w-5" />
        </button>
        
        <button
          type="button"
          disabled={isLoading}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          aria-label="Sign in with Microsoft"
        >
          <FaMicrosoft className="h-5 w-5 text-blue-400" />
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;