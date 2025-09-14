export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL: import.meta.env.BASE_API_URL || 'http://localhost:3000',
} as const;

export const TRANSACTION_CONFIG = {
  DEFAULT_AMOUNT: 10,
  MAX_RECENT_TRANSACTIONS: 10,
} as const;

export const UI_CONFIG = {
  CURRENCY_INPUT_WIDTH: 'w-32',
  MAX_HEIGHT: 'max-h-80',
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
  },
} as const;

export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

export const MAX_TRANSACTIONS_DISPLAY = 10;
export const DEFAULT_TRANSACTION_AMOUNT = 10;
export const CURRENCY_SYMBOL = '$';
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}; 