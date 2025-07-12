import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import FlightList from './components/FlightList';

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen">
        <ProtectedRoute>
          <Header />
          <main className="py-6">
            <FlightList />
          </main>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
