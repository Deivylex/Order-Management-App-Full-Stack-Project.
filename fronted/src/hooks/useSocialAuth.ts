import { useState } from 'react';
import { googleAuthService } from '../services/googleAuth';
import { githubAuthService } from '../services/githubAuth';
import { appleAuthService } from '../services/appleAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


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
        const userData = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name
        };
        
        // Update AuthContext and localStorage
        auth.setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
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
