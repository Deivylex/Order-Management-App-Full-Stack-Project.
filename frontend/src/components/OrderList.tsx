import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import StatusBadge from './StatusBadge';

interface Order {
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
}

const OrderList: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get('/api/order');
        setOrders(response.data);
      } catch (err) {
        setError('Error loading orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600">You must log in to view your orders</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="mt-2 text-gray-600">History of all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.customerName}
                  </h3>
                  <StatusBadge status={order.status} />
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{order.phone}</span>
                  </div>
                  {order.company && (
                    <div className="flex justify-between">
                      <span>Company:</span>
                      <span>{order.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="capitalize">{order.productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{order.tortillaType === 'white' ? 'White' : 'Blue'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{order.size} cm</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Quantity:</span>
                    <span>{order.quantity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
