import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (credentials: { name: string; email: string; password: string }) => Promise<boolean>;
  setUser: (user: User) => void;
  logout: () => void;
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
      //SHOULD MAKE THE BACKEND CALL
      const response = await axios.post('http://localhost:3000/api/login', credentials);
      // CURRENT CODE (SIMULATION) - TO REPLACE:
      console.log("datos", response)
      const userData: User = {
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
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
      //SHOULD MAKE THE BACKEND CALL
      const response = await axios.post('http://localhost:3000/api/users', credentials);
      console.log(response);
      // CURRENT CODE (SIMULATION) - TO REPLACE:
      //await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
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

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {      
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    register,
    setUser,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
