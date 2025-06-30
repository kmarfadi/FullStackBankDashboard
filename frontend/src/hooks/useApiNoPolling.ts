import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { BankBalance, Person, Transaction, ProcessTransactionResponse, TransactionToProcess } from '../types';
import { API_CONFIG } from '../lib/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const useApiDataNoPolling = <T>(endpoint: string, initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: AxiosResponse<T> = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      const message = err instanceof AxiosError 
        ? err.response?.data?.message || err.message 
        : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// No polling version of bank balance hook
export const useBankBalanceNoPolling = () => {
  return useApiDataNoPolling<BankBalance>('/bank/balance', { balance: 0, timestamp: '' });
};

// No polling version of accounts hook
export const useAvailableAccountsNoPolling = () => {
  return useApiDataNoPolling<Person[]>('/persons', []);
};

// No polling version of transactions hook
export const useTransactionsNoPolling = () => {
  return useApiDataNoPolling<Transaction[]>('/transactions', []);
};

// Keep the process transactions hook as is (no polling needed)
export const useProcessTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ProcessTransactionResponse | null>(null);

  const processTransactions = useCallback(async (transactions: TransactionToProcess[]) => {
    try {
      setLoading(true);
      setError(null);
      const response: AxiosResponse<ProcessTransactionResponse> = await api.post('/transactions/process', { transactions });
      setLastResult(response.data);
      return response.data;
    } catch (err) {
      const message = err instanceof AxiosError ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    processTransactions, 
    loading, 
    error, 
    lastResult,
    clearResult: () => setLastResult(null),
    clearError: () => setError(null)
  };
};

export { api }; 