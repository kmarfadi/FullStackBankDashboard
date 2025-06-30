import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { useBankBalance, useAvailableAccounts, useTransactions } from './useApi';
import { BankBalance, Person, Transaction } from '../types';

// Enhanced bank balance hook with WebSocket updates
export const useWebSocketBankBalance = () => {
  const { data, loading, error, refetch } = useBankBalance();
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const [realTimeData, setRealTimeData] = useState<BankBalance | null>(null);

  // Listen for real-time bank balance updates
  useEffect(() => {
    if (!socket) {
      console.log('🔌 No socket available for bank balance updates');
      return;
    }

    const handleBankBalanceUpdate = (data: { balance: number; timestamp: string }) => {
      console.log('💰 Received bank balance update via WebSocket:', data);
      setRealTimeData({ balance: data.balance, timestamp: data.timestamp });
    };

    socket.on('bank-balance-updated', handleBankBalanceUpdate);

    // Subscribe to bank balance updates
    if (isConnected) {
      console.log('📡 Subscribing to bank balance updates');
      subscribe(['bank-balance']);
    } else {
      console.log('❌ Not connected, cannot subscribe to bank balance updates');
    }

    return () => {
      console.log('🧹 Cleaning up bank balance WebSocket listeners');
      socket.off('bank-balance-updated', handleBankBalanceUpdate);
      unsubscribe(['bank-balance']);
    };
  }, [socket, isConnected, subscribe, unsubscribe]);

  // Return real-time data if available, otherwise fall back to API data
  const currentData = realTimeData || data;

  console.log('🏦 Bank balance hook state:', {
    isConnected,
    isRealTime: !!realTimeData,
    realTimeData,
    apiData: data,
    currentData,
  });

  return {
    data: currentData,
    loading,
    error,
    refetch,
    isConnected,
    isRealTime: !!realTimeData,
  };
};

// Enhanced transactions hook with WebSocket updates
export const useWebSocketTransactions = () => {
  const { data, loading, error, refetch } = useTransactions();
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const [realTimeTransactions, setRealTimeTransactions] = useState<Transaction[]>([]);

  // Listen for real-time transaction updates
  useEffect(() => {
    if (!socket) return;

    const handleTransactionCreated = (data: { transaction: Transaction }) => {
      setRealTimeTransactions((prev: Transaction[]) => [data.transaction, ...prev.slice(0, 9)]); // Keep latest 10
    };

    const handleTransactionsProcessed = () => {
      // Refresh transactions when batch is processed
      refetch();
    };

    socket.on('transaction-created', handleTransactionCreated);
    socket.on('transactions-processed', handleTransactionsProcessed);

    // Subscribe to transaction updates
    if (isConnected) {
      subscribe(['transactions']);
    }

    return () => {
      socket.off('transaction-created', handleTransactionCreated);
      socket.off('transactions-processed', handleTransactionsProcessed);
      unsubscribe(['transactions']);
    };
  }, [socket, isConnected, subscribe, unsubscribe, refetch]);

  // Combine API data with real-time updates
  const combinedData = realTimeTransactions.length > 0 
    ? [...realTimeTransactions, ...data.filter((tx: Transaction) => !realTimeTransactions.find((rt: Transaction) => rt.id === tx.id))]
    : data;

  return {
    data: combinedData,
    loading,
    error,
    refetch,
    isConnected,
    hasRealTimeUpdates: realTimeTransactions.length > 0,
  };
};

// Enhanced accounts hook with WebSocket updates
export const useWebSocketAccounts = () => {
  const { data, loading, error, refetch } = useAvailableAccounts();
  const { socket, isConnected, subscribe, unsubscribe } = useWebSocket();
  const [realTimeAccounts, setRealTimeAccounts] = useState<Person[]>([]);

  // Listen for real-time account updates
  useEffect(() => {
    if (!socket) return;

    const handleAccountUpdate = (data: { account: Person }) => {
      setRealTimeAccounts((prev: Person[]) => {
        const existing = prev.find(acc => acc.id === data.account.id);
        if (existing) {
          return prev.map((acc: Person) => acc.id === data.account.id ? data.account : acc);
        } else {
          return [...prev, data.account];
        }
      });
    };

    const handleAccountsRefreshed = () => {
      // Refresh accounts when server broadcasts refresh
      refetch();
    };

    socket.on('account-updated', handleAccountUpdate);
    socket.on('accounts-refreshed', handleAccountsRefreshed);

    // Subscribe to account updates
    if (isConnected) {
      subscribe(['accounts']);
    }

    return () => {
      socket.off('account-updated', handleAccountUpdate);
      socket.off('accounts-refreshed', handleAccountsRefreshed);
      unsubscribe(['accounts']);
    };
  }, [socket, isConnected, subscribe, unsubscribe, refetch]);

  // Merge real-time updates with API data
  const mergedData = data.map((account: Person) => {
    const realTimeAccount = realTimeAccounts.find((rt: Person) => rt.id === account.id);
    return realTimeAccount || account;
  });

  return {
    data: mergedData,
    loading,
    error,
    refetch,
    isConnected,
    hasRealTimeUpdates: realTimeAccounts.length > 0,
  };
};

// WebSocket connection status hook
export const useWebSocketStatus = () => {
  const { isConnected, isConnecting, error } = useWebSocket();
  
  return {
    isConnected,
    isConnecting,
    error,
    status: isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected',
  };
}; 