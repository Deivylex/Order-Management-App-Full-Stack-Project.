import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const api_login = import.meta.env.VITE_API_LOGIN
const api_user = import.meta.env.VITE_API_USER

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (credentials: { name: string; email: string; password: string }) => Promise<boolean>;
  setUser: (user: User) => void;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  quickLoginAdmin: () => Promise<boolean>;
  quickLoginGuest: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post(api_login, credentials);
      const userData: User = {
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role || 'user'
      };     
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: { name: string; email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post(api_user, credentials);
      
      const userData: User = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role || 'user'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      await api.delete(`/api/users/${user.id}`);
      
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      return true;
    } catch (error) {
      console.error('Delete account failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginAdmin = async (): Promise<boolean> => {
    return await login({ email: 'admin', password: 'admin' });
  };

  const quickLoginGuest = async (): Promise<boolean> => {
    return await login({ email: 'guest', password: 'guest' });
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const value = {
    user,
    login,
    register,
    setUser,
    logout,
    deleteAccount,
    quickLoginAdmin,
    quickLoginGuest,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
