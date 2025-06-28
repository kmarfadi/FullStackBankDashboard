import React from 'react';
import { CardHeader } from '@/components/index';

interface TransactionStatusHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  status?: 'idle' | 'processing' | 'completed' | 'error';
  className?: string;
}

const TransactionStatusHeader: React.FC<TransactionStatusHeaderProps> = ({ 
  icon, 
  title, 
  subtitle,
  status = 'idle',
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIndicator = () => {
    if (status === 'processing') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-yellow-600">Processing</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`mb-4 ${className}`}>
      <CardHeader align="left">
        <div className="flex items-center gap-3">
          {icon}
          <div className="flex flex-col">
            <h3 className={`font-semibold text-lg ${getStatusColor()}`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {getStatusIndicator()}
      </CardHeader>
    </div>
  );
};

export default TransactionStatusHeader; 