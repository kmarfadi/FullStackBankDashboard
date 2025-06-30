import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../lib/constants';

export interface WebSocketEvents {
  // Bank balance updates
  'bank-balance-updated': (data: { balance: number; timestamp: string }) => void;
  
  // Transaction updates
  'transaction-created': (data: { transaction: any }) => void;
  'transaction-status-updated': (data: { transactionId: number; status: string }) => void;
  'transactions-processed': (data: { summary: any }) => void;
  
  // Account updates
  'account-updated': (data: { account: any }) => void;
  'accounts-refreshed': (data: { accounts: any[] }) => void;
  
  // System events
  'connection-established': (data: { message: string }) => void;
  'error': (data: { message: string }) => void;
}

export interface UseWebSocketReturn {
  socket: Socket<WebSocketEvents> | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  subscribe: (channels: string[]) => void;
  unsubscribe: (channels: string[]) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const socketRef = useRef<Socket<WebSocketEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    // Create socket connection
    const socket = io(`${API_CONFIG.BASE_URL}/dashboard`, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
      setIsConnecting(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err);
      setError(`Connection failed: ${err.message}`);
      setIsConnecting(false);
    });

    socket.on('error', (data) => {
      console.error('❌ WebSocket error:', data);
      setError(data.message);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const subscribe = useCallback((channels: string[]) => {
    if (socketRef.current?.connected) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (socketRef.current as any).emit('subscribe-to-updates', { channels });
      console.log('📡 Subscribed to channels:', channels);
    }
  }, []);

  const unsubscribe = useCallback((channels: string[]) => {
    if (socketRef.current?.connected) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (socketRef.current as any).emit('unsubscribe-from-updates', { channels });
      console.log('📡 Unsubscribed from channels:', channels);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
  };
}; 