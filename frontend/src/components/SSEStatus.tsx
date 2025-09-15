import React from 'react';
import { useSSE } from '../hooks/useSSE';

const SSEStatus: React.FC = () => {
  const { isConnected, error, reconnect } = useSSE();

  if (!isConnected && !error) {
    return null; // Don't show anything while connecting
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>
            {isConnected ? 'SSE Connected' : 'SSE Disconnected'}
          </span>
          {error && (
            <button 
              onClick={reconnect}
              className="ml-2 text-xs underline hover:no-underline focus:outline-none"
              title="Reconnect to SSE stream"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSEStatus;
