import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import FlightList from './components/FlightList';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState<'flights' | 'profile'>('flights');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'flights':
      default:
        return (
          <main className="py-6">
            <FlightList />
          </main>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="App min-h-screen">
        <ProtectedRoute>
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          {renderCurrentPage()}
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
