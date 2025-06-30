import React, { useState, useCallback, useMemo } from 'react';
import ProcessingTimeCard from "./main-sections/processing-time/ProcessingTimeCard";
import SelectedTransactionsCard from "./main-sections/selected-transaction/SelectedTransactionCard";
import BankBalanceCard from "./main-sections/bank-balace/BankBalanceCard";
import RecentTransactions from "./main-sections/recent-transactions/RecentTransactions";
import AvailableAccounts from "./main-sections/availible-accounts/AvailibleAccounts";
import TransactionBuilder from "./main-sections/transaction-builder/TransactionBuilder";
import { Person, ProcessTransactionResponse } from "@/types";
import { useDashboard } from "../../context/DashboardContext";
import Header from "@/components/Header";

const Dashboard: React.FC = React.memo(() => {
    const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
    const [lastResult, setLastResult] = useState<ProcessTransactionResponse | null>(null);
    const [amounts, setAmounts] = useState<{[key: number]: number}>({});

    // Centralized data from context
    const { 
        accounts, 
        transactions
    } = useDashboard();

    const handleAddTransaction = useCallback((person: Person) => {
        if (!selectedPersons.some(p => p.id === person.id)) {
            setSelectedPersons(prev => [...prev, person]);
        }
    }, [selectedPersons]);
    
    // Remove person from selected transactions
    const handleRemovePerson = useCallback((id: number) => {
        setSelectedPersons(prev => prev.filter(person => person.id !== id));
    }, []);

    // Handle transactions processed callback
    const handleTransactionsProcessed = useCallback((result: ProcessTransactionResponse) => {
        setLastResult(result);
        setSelectedPersons([]);
        // Context will handle real-time updates automatically
        console.log('🔄 Transaction processed, context will handle updates');
    }, []);

    // Calculate total selected amount using amounts state
    const totalSelectedAmount = useMemo(() => 
        selectedPersons.reduce((sum, person) => sum + (amounts[person.id] || 0), 0),
        [selectedPersons, amounts]
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 p-9 m-6">
            <Header />
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
                    <RecentTransactions data={transactions} />
                </div>
            </div>
        </div>
    );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;