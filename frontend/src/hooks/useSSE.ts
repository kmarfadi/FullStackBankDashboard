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

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: SSEMessage = JSON.parse(event.data);
      onMessage?.(message);
    } catch (err) {
      console.error('Failed to parse SSE message:', err);
      setError('Failed to parse server message');
    }
  }, [onMessage]);

  const handleError = useCallback((event: Event) => {
    setIsConnected(false);
    setError('SSE connection error');
    console.error('SSE error:', event);
  }, []);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${API_CONFIG.BASE_URL}${API_CONFIG.SSE_ENDPOINT}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = handleOpen;
    eventSource.onmessage = handleMessage;
    eventSource.onerror = handleError;

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [handleOpen, handleMessage, handleError]);

  const reconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsConnected(false);
    setError(null);
  }, []);

  return { isConnected, error, reconnect };
};