import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import StatusBadge from './StatusBadge';

interface AdminOrder {
  id: string;
  customerName: string;
  phone: string;
  company: string;
  productType: 'tortilla' | 'nacho';
  tortillaType: 'white' | 'blue';
  size: '12' | '18';
  quantity: number;
  status: 'pending' | 'completed' | 'canceled' | 'ongoing';
  notes: string;
  orderDate: string;
  user?: {
    name: string;
    email: string;
  };
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/order/admin/all');
      setOrders(response.data);
    } catch (err) {
      setError('Error loading orders');
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(orderId);
      await api.put(`/api/order/admin/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as AdminOrder['status'] } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/order/admin/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Error deleting order');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-green-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-gray-300 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchAllOrders}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-400">Manage all orders and monitor business activity</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-100">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-slate-500/20 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-400">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Ongoing</p>
                <p className="text-3xl font-bold text-blue-400">
                  {orders.filter(order => order.status === 'ongoing').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">🔄</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {orders.filter(order => order.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No orders found</h3>
            <p className="text-gray-400">No orders have been created yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Recent Orders</h2>
              <button
                onClick={fetchAllOrders}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                <span className="text-sm">🔄</span>
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
            
            <div className="grid gap-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {order.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-100">
                            {order.customerName}
                          </h3>
                          <p className="text-gray-400 text-sm">Order #{order.id.slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={order.status} size="lg" />
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Order Date</p>
                          <p className="text-gray-200 font-medium">{formatDate(order.orderDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wide">Customer Info</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400">👤</span>
                            <div>
                              <p className="text-gray-200 text-sm font-medium">{order.user?.name || 'Unknown User'}</p>
                              <p className="text-gray-400 text-xs">{order.user?.email || 'No email'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400">📞</span>
                            <p className="text-gray-200 text-sm">{order.phone}</p>
                          </div>
                          {order.company && (
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-400">🏢</span>
                              <p className="text-gray-200 text-sm">{order.company}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wide">Product Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-orange-400">🌮</span>
                            <p className="text-gray-200 text-sm font-medium capitalize">{order.productType}</p>
                          </div>
                          {order.productType === 'tortilla' && (
                            <>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">•</span>
                                <p className="text-gray-300 text-sm">
                                  {order.tortillaType === 'white' ? 'White' : 'Blue'} Tortilla
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">📏</span>
                                <p className="text-gray-300 text-sm">{order.size} cm diameter</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Status */}
                      <div className="space-y-3">
                        <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wide">Order Info</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">⚖️</span>
                            <p className="text-gray-200 text-sm font-medium">{order.quantity} kg</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wide">Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={statusUpdateLoading === order.id}
                              className="text-sm bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:ring-blue-500 focus:border-blue-500 flex-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="completed">Completed</option>
                              <option value="canceled">Canceled</option>
                            </select>
                            {statusUpdateLoading === order.id && (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-blue-500"></div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="w-full text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 font-medium px-3 py-2 border border-red-800 rounded-lg transition-colors"
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {order.notes && (
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-gray-300 font-medium text-sm uppercase tracking-wide mb-2">Order Notes</h4>
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <p className="text-gray-300 text-sm">{order.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
