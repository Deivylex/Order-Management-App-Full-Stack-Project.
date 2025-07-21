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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchAllOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage all orders</p>
          <div className="mt-4 text-sm text-gray-500">
            Total Orders: {orders.length}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders have been created yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.customerName}
                          </h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span>
                          <div>{order.user?.name || 'Unknown User'}</div>
                          <div className="text-xs text-gray-500">{order.user?.email || 'No email'}</div>
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span>
                          <div>{order.phone}</div>
                          {order.company && (
                            <div className="text-xs text-gray-500">{order.company}</div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Product:</span>
                          <div className="capitalize">{order.productType}</div>
                          {order.productType === 'tortilla' && (
                            <div className="text-xs text-gray-500">
                              {order.tortillaType === 'white' ? 'White' : 'Blue'} - {order.size} cm
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <div>{order.quantity} kg</div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {order.notes}
                        </div>
                      )}

                      <div className="mt-4 flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={statusUpdateLoading === order.id}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                          </select>
                          {statusUpdateLoading === order.id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
