import React from 'react';
import { Clock, TrendingDown } from 'lucide-react';

interface ProcessingTimeRowProps {
  time: number;
  previousTime?: number;
  showTrend?: boolean;
  className?: string;
}

const ProcessingTimeRow: React.FC<ProcessingTimeRowProps> = ({ 
  time, 
  previousTime, 
  showTrend = false,
  className = ''
}) => {
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  const getTrendIcon = () => {
    if (!showTrend || !previousTime) return null;
    
    if (time < previousTime) {
      return <TrendingDown className="text-green-500" size={14} />;
    } else if (time > previousTime) {
      return <TrendingDown className="text-red-500" size={14} />;
    }
    return null;
  };

  const getTrendText = () => {
    if (!showTrend || !previousTime) return null;
    
    const difference = time - previousTime;
    const percentage = Math.round((Math.abs(difference) / previousTime) * 100);
    
    if (difference < 0) {
      return `Faster by ${percentage}%`;
    } else if (difference > 0) {
      return `Slower by ${percentage}%`;
    }
    return 'No change';
  };

  return (
    <div className={`pt-3 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-500" size={16} />
          <span className="text-sm font-medium text-gray-700">Processing Time</span>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className="text-lg font-bold text-blue-600">
            {formatTime(time)}
          </span>
        </div>
      </div>
      {showTrend && previousTime && (
        <div className="mt-1 text-xs text-gray-500">
          {getTrendText()}
        </div>
      )}
    </div>
  );
};

export default ProcessingTimeRow; 