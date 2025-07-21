import { useState } from 'react';
import { googleAuthService } from '../services/googleAuth';
import { githubAuthService } from '../services/githubAuth';
import { appleAuthService } from '../services/appleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
const api_auth = import.meta.env.VITE_API_AUTH

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await googleAuthService.signIn();
          break;
        case 'github':
          result = await githubAuthService.signIn();
          break;
        case 'apple':
          result = await appleAuthService.signIn();
          break;
      }

      if (result.success && result.user) {
        const credentials = {
            name: result.user.name,
            email: result.user.email,
        }
        const response = await api.post(api_auth, credentials)
        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role || 'user'
        };
        auth.setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        
        navigate('/');
        return true;
      } else {
        setError(result.error || `${provider} authentication failed`);
        return false;
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      setError(`${provider} authentication failed`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSocialAuth,
    isLoading,
    error
  };
};
