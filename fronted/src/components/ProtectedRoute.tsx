import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    if (showRegister) {
      return <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginPage onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;