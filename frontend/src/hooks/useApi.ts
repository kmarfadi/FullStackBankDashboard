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

const useApiData = <T>(endpoint: string, initialData: T) => {
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

export const useBankBalance = () => {
  const { data, loading, error, refetch } = useApiData<BankBalance>('/bank/balance', { balance: 0, timestamp: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
        }, [refetch]);

  return { data, loading, error, refetch };
};

export const useAvailableAccounts = () =>
  useApiData<Person[]>('/persons', []);

export const useTransactions = () => 
  useApiData<Transaction[]>('/transactions', []);

export const useRecentTransactions = () => 
  useApiData<Transaction[]>('/transactions', []);

export const usePerson = (id: number | null) => {
  const [data, setData] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerson = useCallback(async (personId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response: AxiosResponse<Person> = await api.get(`/persons/${personId}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof AxiosError ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchPerson(id);
  }, [id, fetchPerson]);

  return { data, loading, error, refetch: () => id && fetchPerson(id) };
};

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

export const useLiveUpdates = (refetchFunctions: (() => void)[], interval = 5000) => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const intervalId = setInterval(() => refetchFunctions.forEach(fn => fn()), interval);
    return () => clearInterval(intervalId);
  }, [isLive, refetchFunctions, interval]);

  return { isLive, setIsLive, toggleLive: () => setIsLive((v) => !v) };
};

export { api };
