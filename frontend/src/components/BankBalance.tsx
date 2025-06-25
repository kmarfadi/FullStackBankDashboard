/**
 * Component for displaying bank balance with real-time updates
 */

import React from 'react';
import { Bank } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, TrendingUp, RefreshCw } from 'lucide-react';

interface BankBalanceProps {
  bank: Bank | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

/**
 * Bank balance display component with real-time updates
 */
export default function BankBalance({ bank, loading, error, lastUpdated }: BankBalanceProps) {
  
  /**
   * Format currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Format last updated time
   */
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Balance
          </div>
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Failed to load bank balance</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : bank ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">{bank.name}</p>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(Number(bank.balance))}
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Badge variant="secondary" className="text-xs">
                  Live Balance
                </Badge>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Last updated: {formatLastUpdated(lastUpdated)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
