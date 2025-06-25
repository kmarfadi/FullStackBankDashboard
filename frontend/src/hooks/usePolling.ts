/**
 * Custom hook for polling API endpoints at regular intervals
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePollingOptions {
  interval: number;
  enabled: boolean;
  onError?: (error: Error) => void;
}

interface UsePollingResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for polling API endpoints with automatic cleanup
 */
export function usePolling<T>(
  fetchFunction: () => Promise<T>,
  options: UsePollingOptions
): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch data from the API
   */
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, options.onError]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  /**
   * Set up polling interval
   */
  useEffect(() => {
    if (options.enabled) {
      // Initial fetch
      fetchData();

      // Set up polling
      intervalRef.current = setInterval(fetchData, options.interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      // Clean up interval if polling is disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [fetchData, options.enabled, options.interval]);

  return { data, loading, error, refetch };
}