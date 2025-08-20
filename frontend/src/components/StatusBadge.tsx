import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'ongoing' | 'completed' | 'canceled';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          icon: '⏳',
          text: 'Pending'
        };
      case 'ongoing':
        return {
          color: 'bg-blue-100 text-blue-800 border border-blue-200',
          icon: '🔄',
          text: 'Ongoing'
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border border-green-200',
          icon: '✅',
          text: 'Completed'
        };
      case 'canceled':
        return {
          color: 'bg-red-100 text-red-800 border border-red-200',
          icon: '❌',
          text: 'Canceled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border border-gray-200',
          icon: '❓',
          text: status
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses}`}>
      <span className="text-xs">{config.icon}</span>
      <span>{config.text}</span>
    </span>
  );
};

export default StatusBadge;
