import React from 'react';

interface StatusRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueColor: string;
  showPercentage?: boolean;
  total?: number;
  className?: string;
}

const StatusRow: React.FC<StatusRowProps> = ({ 
  icon, 
  label, 
  value, 
  valueColor, 
  showPercentage = false,
  total,
  className = ''
}) => {
  const percentage = showPercentage && total ? Math.round((value / total) * 100) : null;
  
  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {percentage !== null && (
            <span className="text-xs text-gray-500">{percentage}% of total</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${valueColor}`}>
          {value.toLocaleString()}
        </span>
        {percentage !== null && (
          <span className="text-xs text-gray-400">({percentage}%)</span>
        )}
      </div>
    </div>
  );
};

export default StatusRow; 