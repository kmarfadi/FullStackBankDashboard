// Types for props
export interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  mainValue: string | number;
  mainValueColor: string;
  subtitle: React.ReactNode;
  footer?: string;
  className?: string;
}

export interface BankBalanceCardProps {
  balance?: number;
  lastUpdated?: string;
}

export interface AvailableAccountsProps {
  accounts: Person[];
  onAddTransaction?: (person: Person) => void;
}

export interface SelectedTransactionsCardProps {
  count?: number;
  total?: number;
}

export interface ProcessingTimeCardProps {
  time?: number;
  unit?: string;
}

export interface TransactionItemProps {
  name: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed' | 'pending';
}

export interface ItemCardProps {
  // Main data
  name: string;
  value?: number | string;
  valueColor?: string;
  // Simple string metadata
  subtitle?: string;
  statusText?: string;
  statusColor?: string;
  // Button props (if needed)
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface AccountItemProps {
  id: number;
  name: string;
  joinDate: string;
  balance: number;
  onAddTransaction: (id: number) => void;
}

export interface TransactionAccountItemProps {
  id: number;
  name: string;
  amount: number;
  onAmountChange: (amount: number) => void;
}

export interface TransactionStatusProps {
  successful: number;
  failed: number;
  time: number;
}

// Reusable type for amounts state
export type AmountsMap = { [key: number]: number };

export interface TransactionBuilderProps {
  selectedPersons: Person[];
  onTransactionsProcessed: (result: any) => void;
  onRemovePerson: (id: number) => void;
  amounts: AmountsMap;
  setAmounts: React.Dispatch<React.SetStateAction<AmountsMap>>;
}

// Types based on the API responses
export interface BankBalance {
  balance: number;
  timestamp: string;
}

export interface BankInfo {
  id: number;
  name: string;
  balance: string;
  updatedAt: string;
}

export interface Person {
  id: number;
  name: string;
  balance?: string;
  createdAt?: string;
}

export interface Transaction {
  id: number;
  personId: number;
  bankId: number;
  amount: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  person: Person;
  bank: BankInfo;
}

export interface TransactionToProcess {
  personId: number;
  amount: number;
}

export interface ProcessTransactionResponse {
  successful: number;
  failed: number;
  processingTime: number;
  summary: {
    total: number;
    completed: number;
    failed: number;
    details: Array<{
      error: any;
      index: number;
      status: string;
      transaction: {
        id: number;
        personId: number;
        bankId: number;
        amount: number;
        status: string;
        createdAt: string;
        completedAt: string;
      };
    }>;
    processingTime: number;
  };
}

export interface TransactionDetail {
  index: number;
  status: 'completed' | 'failed' | 'pending';
  transaction?: {
    id: number;
    personId: number;
    bankId: number;
    amount: number;
    status: string;
    createdAt: string;
    completedAt: string;
  };
  error?: string;
}

export interface ProcessingSummary {
  total: number;
  completed: number;
  failed: number;
  details: TransactionDetail[];
  processingTime?: number;
}