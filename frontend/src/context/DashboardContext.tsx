import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useBankBalanceNoPolling, useAvailableAccountsNoPolling, useTransactionsNoPolling } from '../hooks/useApiNoPolling';
import { BankBalance, Person, Transaction } from '../types';

interface DashboardContextType {
  // Data
  bankBalance: BankBalance | null;
  accounts: Person[];
  transactions: Transaction[];
  
  // Loading states
  loading: {
    bankBalance: boolean;
    accounts: boolean;
    transactions: boolean;
  };
  
  // Error states
  errors: {
    bankBalance: string | null;
    accounts: string | null;
    transactions: string | null;
  };
  
  // WebSocket status
  wsStatus: {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
  };
  
  // Real-time indicators
  realTime: {
    bankBalance: boolean;
    accounts: boolean;
    transactions: boolean;
  };
  
  // Actions
  refetchAll: () => void;
  refetchBankBalance: () => void;
  refetchAccounts: () => void;
  refetchTransactions: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  // WebSocket connection
  const { socket, isConnected, isConnecting, error: wsError } = useWebSocket();
  
  // API hooks for initial data (no polling)
  const { data: apiBankBalance, loading: bankBalanceLoading, error: bankBalanceError, refetch: refetchBankBalance } = useBankBalanceNoPolling();
  const { data: apiAccounts, loading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useAvailableAccountsNoPolling();
  const { data: apiTransactions, loading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactionsNoPolling();
  
  // Real-time data state
  const [realTimeBankBalance, setRealTimeBankBalance] = useState<BankBalance | null>(null);
  const [realTimeAccounts, setRealTimeAccounts] = useState<Person[]>([]);
  const [realTimeTransactions, setRealTimeTransactions] = useState<Transaction[]>([]);
  
  // Real-time indicators
  const [realTimeIndicators, setRealTimeIndicators] = useState({
    bankBalance: false,
    accounts: false,
    transactions: false,
  });

  // WebSocket event handlers
  const handleBankBalanceUpdate = useCallback((data: { balance: number; timestamp: string }) => {
    console.log('💰 Centralized: Received bank balance update via WebSocket:', data);
    setRealTimeBankBalance({ balance: data.balance, timestamp: data.timestamp });
    setRealTimeIndicators(prev => ({ ...prev, bankBalance: true }));
  }, []);

  const handleTransactionCreated = useCallback((data: { transaction: Transaction }) => {
    console.log('📊 Centralized: Received transaction update via WebSocket:', data);
    setRealTimeTransactions(prev => [data.transaction, ...prev.slice(0, 9)]); // Keep latest 10
    setRealTimeIndicators(prev => ({ ...prev, transactions: true }));
  }, []);

  const handleTransactionsProcessed = useCallback(() => {
    console.log('✅ Centralized: Transactions processed, refetching all data');
    refetchTransactions();
    refetchAccounts();
    refetchBankBalance();
  }, [refetchTransactions, refetchAccounts, refetchBankBalance]);

  const handleAccountUpdate = useCallback((data: { account: Person }) => {
    console.log('👤 Centralized: Received account update via WebSocket:', data);
    setRealTimeAccounts(prev => {
      const existing = prev.find(acc => acc.id === data.account.id);
      if (existing) {
        return prev.map(acc => acc.id === data.account.id ? data.account : acc);
      } else {
        return [...prev, data.account];
      }
    });
    setRealTimeIndicators(prev => ({ ...prev, accounts: true }));
  }, []);

  const handleAccountsRefreshed = useCallback(() => {
    console.log('👥 Centralized: Accounts refreshed, refetching accounts');
    refetchAccounts();
  }, [refetchAccounts]);

  // Set up WebSocket listeners
  useEffect(() => {
    if (!socket) {
      console.log('🔌 Centralized: No socket available');
      return;
    }

    console.log('📡 Centralized: Setting up WebSocket listeners');

    // Bank balance updates
    socket.on('bank-balance-updated', handleBankBalanceUpdate);
    
    // Transaction updates
    socket.on('transaction-created', handleTransactionCreated);
    socket.on('transactions-processed', handleTransactionsProcessed);
    
    // Account updates
    socket.on('account-updated', handleAccountUpdate);
    socket.on('accounts-refreshed', handleAccountsRefreshed);

    // Subscribe to all update channels
    if (isConnected) {
      console.log('📡 Centralized: Subscribing to all update channels');
      (socket as any).emit('subscribe-to-updates', { 
        channels: ['bank-balance', 'transactions', 'accounts'] 
      });
    }

    return () => {
      console.log('🧹 Centralized: Cleaning up WebSocket listeners');
      socket.off('bank-balance-updated', handleBankBalanceUpdate);
      socket.off('transaction-created', handleTransactionCreated);
      socket.off('transactions-processed', handleTransactionsProcessed);
      socket.off('account-updated', handleAccountUpdate);
      socket.off('accounts-refreshed', handleAccountsRefreshed);
      
      if (isConnected) {
        (socket as any).emit('unsubscribe-from-updates', { 
          channels: ['bank-balance', 'transactions', 'accounts'] 
        });
      }
    };
  }, [socket, isConnected, handleBankBalanceUpdate, handleTransactionCreated, handleTransactionsProcessed, handleAccountUpdate, handleAccountsRefreshed]);

  // Combine real-time and API data
  const bankBalance = realTimeBankBalance || apiBankBalance;
  const accounts = realTimeAccounts.length > 0 
    ? apiAccounts.map(account => {
        const realTimeAccount = realTimeAccounts.find(rt => rt.id === account.id);
        return realTimeAccount || account;
      })
    : apiAccounts;
  const transactions = realTimeTransactions.length > 0 
    ? [...realTimeTransactions, ...apiTransactions.filter(tx => !realTimeTransactions.find(rt => rt.id === tx.id))]
    : apiTransactions;

  const refetchAll = useCallback(() => {
    refetchBankBalance();
    refetchAccounts();
    refetchTransactions();
  }, [refetchBankBalance, refetchAccounts, refetchTransactions]);

  const contextValue: DashboardContextType = {
    // Data
    bankBalance,
    accounts,
    transactions,
    
    // Loading states
    loading: {
      bankBalance: bankBalanceLoading,
      accounts: accountsLoading,
      transactions: transactionsLoading,
    },
    
    // Error states
    errors: {
      bankBalance: bankBalanceError,
      accounts: accountsError,
      transactions: transactionsError,
    },
    
    // WebSocket status
    wsStatus: {
      isConnected,
      isConnecting,
      error: wsError,
    },
    
    // Real-time indicators
    realTime: realTimeIndicators,
    
    // Actions
    refetchAll,
    refetchBankBalance,
    refetchAccounts,
    refetchTransactions,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}; 