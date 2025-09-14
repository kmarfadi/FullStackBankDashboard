import { useEffect, useRef, useState } from 'react';
import { API_CONFIG } from '../lib/constants';

export interface SSEMessage {
  type: 'bank_balance';
  data: {
    balance: number;
    timestamp: string;
  };
  timestamp: string;
}

export const useSSE = (onMessage?: (message: SSEMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${API_CONFIG.BASE_URL}/sse/events`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        onMessage?.(message);
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
        setError('Failed to parse server message');
      }
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      setError('SSE connection error');
      console.error('SSE error:', event);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [onMessage]);

  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsConnected(false);
    setError(null);
  };

  return { isConnected, error, reconnect };
};