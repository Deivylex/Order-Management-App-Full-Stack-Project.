import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

type Client = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  [key: string]: unknown;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const ClientList: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchClients = async (page: number = 1, reset: boolean = true) => {
    if (reset) {
      setLoading(true);
      setError('');
      setClients([]);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await api.get(`/api/test?page=${page}&limit=10`);
      const { clients: newClients, pagination: paginationInfo } = response.data;
      
      // Asignar IDs únicos si no vienen del servidor
      const clientsWithIds = newClients.map((client: Omit<Client, 'id'>, index: number) => ({
        ...client,
        id: client.id || `client_${page}_${index}_${Date.now()}`
      }));

      if (reset) {
        setClients(clientsWithIds);
      } else {
        setClients(prev => [...prev, ...clientsWithIds]);
      }
      
      setPagination(paginationInfo);
      setCurrentPage(page);
    } catch (err) {
      setError(`Failed to fetch clients: ${(err as Error).message}`);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreClients = useCallback(() => {
    if (pagination && pagination.hasNextPage && !loadingMore) {
      fetchClients(currentPage + 1, false);
    }
  }, [pagination, currentPage, loadingMore]);

  // Configurar IntersectionObserver para scroll infinito
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreClients();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreClients]);

  const handleLoadClients = () => {
    fetchClients(1, true);
  };

  // Solo mostrar para usuarios admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-slate-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-100 mb-2">Loading Client Database...</p>
            <p className="text-gray-400 mb-1">Fetching client information</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-slate-400 mt-3 font-medium">
              📊 Loaded: {clients.length} clients
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
              Client Database
            </h2>
            <p className="text-gray-400 mt-1">Manage and view client information</p>
          </div>
        </div>
        <button
          onClick={handleLoadClients}
          disabled={loading}
          className="relative bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span className="text-lg">📊</span>
          <span>Load Clients</span>
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-400 text-lg">⚠️</span>
            </div>
            <div>
              <p className="text-red-300 font-medium">Error loading clients</p>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {clients.length > 0 && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl px-4 py-2 border border-gray-600">
              <p className="text-gray-300 text-sm">
                Showing: <span className="font-bold text-slate-400">{clients.length}</span> of{' '}
                <span className="font-bold text-gray-300">{pagination?.totalClients || 0}</span> clients
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-600">
              Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
            </div>
          </div>
          
          <div className="grid gap-6 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div
                key={client.id}
                className="relative bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-xl p-6 hover:from-gray-650 hover:to-gray-750 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {/* Header con nombre y empresa */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-1">
                        {client.name}
                      </h3>
                      <div className="flex items-center text-gray-400">
                        <span className="mr-2">🏢</span>
                        <span className="text-sm font-medium">{client.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                    #{client.id?.slice(-6)}
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                      <div className="w-10 h-10 bg-slate-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 text-lg">📩</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</p>
                        <p className="text-slate-400 text-sm font-medium truncate" title={client.email}>
                          {client.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-400 text-lg">📞</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                        <p className="text-emerald-400 text-sm font-medium truncate" title={client.phone}>
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 text-lg">📍</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Address</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {client.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-500/10 via-gray-500/10 to-slate-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
            
            {/* Elemento de referencia para scroll infinito */}
            {pagination && pagination.hasNextPage && (
              <div ref={loadMoreRef} className="py-4">
                {loadingMore ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-slate-500"></div>
                    <span className="text-gray-400">Loading more clients...</span>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Scroll down to load more clients
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Información final cuando no hay más páginas */}
          {pagination && !pagination.hasNextPage && clients.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-xl text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-green-400">✅</span>
                <p className="text-gray-300 font-medium">
                  All {pagination.totalClients} clients loaded
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                🎉 You've reached the end of the client list
              </p>
            </div>
          )}
        </>
      )}
      
      {clients.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Clients Loaded</h3>
          <p className="text-gray-400 mb-6">Click "Load Clients" to view the client database with infinite scroll</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
