import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Header />
                <main className="py-6">
                </main>
              </ProtectedRoute>
            } />
            
            <Route path="/flights" element={
              <ProtectedRoute>
                <Header />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Header />
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <Header />
                <MyBookingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Header />
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
