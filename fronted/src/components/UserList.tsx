import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

type Client = {
  id?: string;
  name: string;
  correo: string;
  phone: string;
  company: string;
  direccion: string;
  [key: string]: unknown;
};

const ClientList: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [totalLoaded, setTotalLoaded] = useState<number>(0);

  // Solo mostrar para usuarios admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    setClients([]);
    setTotalLoaded(0);

    try {
      const response = await api.get('/api/clients', {
        responseType: 'text'
      });
      const lines = response.data.split('\n').filter((line: string) => line.trim());
      const allClients: Client[] = [];

      for (const line of lines) {
        try {
          const clientsChunk = JSON.parse(line);
          // Asignar IDs únicos si no vienen del servidor
          const clientsWithIds = clientsChunk.map((client: Omit<Client, 'id'>, index: number) => ({
            ...client,
            id: client.id || `client_${allClients.length + index}_${Date.now()}`
          }));
          allClients.push(...clientsWithIds);
          setTotalLoaded(allClients.length);
        } catch (parseError) {
          console.error('Error parsing chunk:', parseError);
        }
      }

      setClients(allClients);
    } catch (err) {
      setError(`Failed to fetch clients: ${(err as Error).message}`);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
            <div className="text-gray-200">
              <p className="text-lg font-medium">Loading clients...</p>
              <p className="text-sm text-gray-400">Loaded: {totalLoaded} clients</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 flex items-center">
              👥 Client Database
            </h2>
            <p className="text-gray-400 mt-1">Manage and view client information</p>
          </div>
          <button
            onClick={fetchClients}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-600 text-gray-100 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <span>📊</span>
            <span>Load Clients</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="text-gray-300 text-sm">
          Total clients loaded: <span className="font-bold text-slate-300">{clients.length}</span>
        </div>
      </div>

      {clients.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Client List ({clients.length} total)
          </h3>
          
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {clients.slice(0, 50).map((client) => (
              <div
                key={client.id}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Información principal */}
                  <div className="space-y-2">
                    <div className="font-medium text-gray-100 flex items-center">
                      <span className="mr-2">👤</span>
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <span className="mr-2">📧</span>
                      {client.correo}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <span className="mr-2">📞</span>
                      {client.phone}
                    </div>
                  </div>
                  
                  {/* Información de empresa */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300 flex items-center">
                      <span className="mr-2">🏢</span>
                      <span className="font-medium">Company:</span>
                    </div>
                    <div className="text-sm text-gray-400 pl-6">
                      {client.company}
                    </div>
                  </div>
                  
                  {/* Dirección */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300 flex items-center">
                      <span className="mr-2">📍</span>
                      <span className="font-medium">Address:</span>
                    </div>
                    <div className="text-sm text-gray-400 pl-6">
                      {client.direccion}
                    </div>
                  </div>
                </div>
                
                {/* ID en la esquina */}
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-gray-500 text-right">
                    ID: {client.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {clients.length > 50 && (
            <div className="mt-4 p-3 bg-gray-700 border border-gray-600 rounded-lg text-center">
              <p className="text-gray-300 text-sm">
                Showing first 50 clients of {clients.length} total
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Contact admin for full client export
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientList;
