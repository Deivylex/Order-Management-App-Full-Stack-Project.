import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface OrderData {
  customerName: string;
  phone: string;
  company: string;
  productType: 'tortilla' | 'nacho';
  tortillaType: 'white' | 'blue';
  size: '12' | '18';
  quantity: number; // in kg
  notes: string;
}

interface OrderFormProps {
  onOrderCreated?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<OrderData>({
    customerName: '',
    phone: '',
    company: '',
    productType: 'tortilla',
    tortillaType: 'white',
    size: '12',
    quantity: 1,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await api.post('/api/order', formData);
      setSubmitMessage({ type: 'success', text: 'Order created successfully' });
      setFormData({
        customerName: '',
        phone: '',
        company: '',
        productType: 'tortilla',
        tortillaType: 'white',
        size: '12',
        quantity: 1,
        notes: ''
      });
      
      // Redirect to My Orders immediately after successful creation
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (error: unknown) {
      let errorMessage = 'Error creating order';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      }
      
      setSubmitMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600">You must log in to create orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Product Order</h2>
          <p className="mt-2 text-gray-600">Complete the form to create a new order</p>
        </div>

        {submitMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full customer name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Company name (optional)"
            />
          </div>

          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tortilla">Tortilla</option>
              <option value="nacho">Nacho</option>
            </select>
          </div>

          <div>
            <label htmlFor="tortillaType" className="block text-sm font-medium text-gray-700 mb-1">
              Tortilla Type {formData.productType === 'tortilla' ? '*' : ''}
            </label>
            <select
              id="tortillaType"
              name="tortillaType"
              value={formData.tortillaType}
              onChange={handleChange}
              required={formData.productType === 'tortilla'}
              disabled={formData.productType === 'nacho'}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                formData.productType === 'nacho' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : ''
              }`}
            >
              <option value="white">White Tortilla</option>
              <option value="blue">Blue Tortilla</option>
            </select>
            {formData.productType === 'nacho' && (
              <p className="mt-1 text-xs text-gray-500">Tortilla type is not applicable for nachos</p>
            )}
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
              Size {formData.productType === 'tortilla' ? '*' : ''}
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required={formData.productType === 'tortilla'}
              disabled={formData.productType === 'nacho'}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                formData.productType === 'nacho' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : ''
              }`}
            >
              <option value="12">12 cm</option>
              <option value="18">18 cm</option>
            </select>
            {formData.productType === 'nacho' && (
              <p className="mt-1 text-xs text-gray-500">Size is not applicable for nachos</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (kg) *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max="1000"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Quantity in kilograms"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Special instructions or comments (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
