import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';

const MyBookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'new'>('orders');

  const handleOrderCreated = () => {
    setActiveTab('orders');
  };

  return (
    <div className="bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'new' && <OrderForm onOrderCreated={handleOrderCreated} />}
      </div>
    </div>
  );
};

export default MyBookingsPage;
