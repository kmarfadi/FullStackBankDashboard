import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StatusAlertProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  details?: React.ReactNode;
  className?: string;
}

const StatusAlert: React.FC<StatusAlertProps> = ({
  type,
  title,
  details,
  className = '',
}) => {
  const config = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  };

  const { icon: Icon, color, bgColor, borderColor } = config[type];

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-3 ${className}`}>
      <div className={`flex items-center ${color} mb-1`}>
        <Icon size={18} className="mr-1.5" />
        <span className="font-medium">{title}</span>
      </div>
      {details && <div className="text-sm text-gray-600 ml-6">{details}</div>}
    </div>
  );
};

export default StatusAlert; 