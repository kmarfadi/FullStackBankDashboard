import {useState} from 'react';
import ProcessingTimeCard from "@/components/processing-time/ProcessingTimeCard";
import SelectedTransactionsCard from "@/components/selected-transaction/SelectedTransactionCard";
import BankBalanceCard from "@/components/bank-balace/BankBalanceCard";
import RecentTransactions from "@/components/recent-transactions/RecentTransactions";
import AvailableAccounts from "@/components/availible-accounts/AvailibleAccounts";
import TransactionBuilder from "@/components/transaction-builder/TransactionBuilder";
import { Person } from "@/types";
import { useAvailableAccounts, useRecentTransactions, useBankBalance } from "@/hooks/useApi";

//const POLL_INTERVAL = 3000;

const Dashboard: React.FC = () => {
    const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
    const [lastResult, setLastResult] = useState(null);
    const [amounts, setAmounts] = useState<{[key: number]: number}>({});

    // Hooks for data and refetch
    const { data: accounts, refetch: refetchAccounts } = useAvailableAccounts();
    const { data: recentTransactions, refetch: refetchRecentTransactions } = useRecentTransactions();
    const { refetch: refetchBankBalance } = useBankBalance();

    const handleAddTransaction = (person: Person) => {
        if (!selectedPersons.some(p => p.id === person.id)) {
            setSelectedPersons([...selectedPersons, person]);
        }
    };
    
    // Remove person from selected transactions
    const handleRemovePerson = (id: number) => {
        setSelectedPersons(selectedPersons.filter(person => person.id !== id));
    };

    // Handle transactions processed callback
    const handleTransactionsProcessed = (result: any) => {
        setLastResult(result);
        setSelectedPersons([]);
        refetchRecentTransactions();
        refetchAccounts();
        refetchBankBalance();
    };

    // Calculate total selected amount using amounts state
    const totalSelectedAmount = selectedPersons.reduce(
        (sum, person) => sum + (amounts[person.id] || 0),
        0
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200 text-gray-800 p-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
                Financial Transaction Dashboard
            </h1>
            <p className="max-w-5xl text-xs md:text-base text-gray-400 mb-8 text-center">
                This dashboard provides a real-time overview of financial transactions, including bank balances, processing times, and recent activity.
            </p>
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    <BankBalanceCard />
                    <SelectedTransactionsCard 
                        count={selectedPersons.length}
                        total={totalSelectedAmount}
                    />
                    <ProcessingTimeCard lastResult={lastResult} />
                    <AvailableAccounts
                        accounts={accounts}
                        onAddTransaction={handleAddTransaction}
                    />
                    <TransactionBuilder
                        selectedPersons={selectedPersons}
                        onTransactionsProcessed={handleTransactionsProcessed}
                        onRemovePerson={handleRemovePerson}
                        amounts={amounts}
                        setAmounts={setAmounts}
                    />
                    <RecentTransactions data={recentTransactions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;