import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface WebSocketStatusProps {
  className?: string;
  showDetails?: boolean;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const { wsStatus, realTime } = useDashboard();

  const getStatusColor = () => {
    if (wsStatus.isConnecting) return 'text-yellow-500';
    if (wsStatus.isConnected) return 'text-green-500';
    return 'text-red-500';
  };

  const getStatusIcon = () => {
    if (wsStatus.isConnecting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (wsStatus.isConnected) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (wsStatus.isConnecting) return 'Connecting...';
    if (wsStatus.isConnected) return 'Live';
    return 'Offline';
  };

  const getRealTimeStatus = () => {
    const activeChannels = Object.values(realTime).filter(Boolean).length;
    if (activeChannels > 0) {
      return `${activeChannels} real-time channels active`;
    }
    return 'Using polling fallback';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center gap-1.5 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-semibold">{getStatusText()}</span>
      </div>
      
      {showDetails && (
        <div className="text-xs text-gray-600 border-l border-gray-200 pl-2">
          {wsStatus.isConnected && <span>{getRealTimeStatus()}</span>}
          {wsStatus.isConnecting && <span>Establishing connection...</span>}
          {!wsStatus.isConnected && !wsStatus.isConnecting && (
            <span>Using polling fallback</span>
          )}
        </div>
      )}
      
      {wsStatus.error && showDetails && (
        <div className="text-xs text-red-500 border-l border-red-200 pl-2">
          Error: {wsStatus.error}
        </div>
      )}
    </div>
  );
};

export default WebSocketStatus; 