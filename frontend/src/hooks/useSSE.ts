import { useEffect, useRef, useState, useCallback } from 'react';
import { API_CONFIG } from '../lib/constants';

export interface SSEMessage {
  type: 'bank_balance' | 'transaction' | 'account_update';
  data: any;
  timestamp: string;
}

export interface BankBalanceSSEData {
  balance: number;
  timestamp: string;
}

export interface TransactionSSEData {
  id: number;
  personId: number;
  bankId: number;
  amount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export interface AccountSSEData {
  id: number;
  name: string;
  balance: number;
  updatedAt: string;
}

export const useSSE = (onMessage?: (message: SSEMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep the latest onMessage callback in a ref to avoid recreating connections
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const eventSource = new EventSource(`${API_CONFIG.BASE_URL}${API_CONFIG.SSE_ENDPOINT}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        onMessageRef.current?.(message);
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
        setError('Failed to parse server message');
      }
    };

    eventSource.onerror = (event: Event) => {
      setIsConnected(false);
      setError('SSE connection error');
      console.error('SSE error:', event);
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []); // Empty dependency array - only create connection once

  const reconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsConnected(false);
    setError(null);
  }, []);

  return { isConnected, error, reconnect };
};