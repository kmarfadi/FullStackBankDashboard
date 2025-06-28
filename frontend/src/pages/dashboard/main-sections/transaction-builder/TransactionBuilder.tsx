import React, { useEffect } from 'react';
import { DollarSign, X } from 'lucide-react';
import TransactionStatus from './TransactionStatus';
import TransactionAccountItem from './TransactionAccountItem';
import { useProcessTransactions } from '@/hooks/useApi';
import { TransactionBuilderProps } from '@/types';
import { SectionCard, SectionHeader, SectionSubtitle, PrimaryButton, EmptyState } from '@/components/index';
import { TRANSACTION_CONFIG } from '@/lib/constants';

const TransactionBuilder: React.FC<TransactionBuilderProps> = ({
  selectedPersons,
  onTransactionsProcessed,
  onRemovePerson,
  amounts,
  setAmounts
}) => {
  const { processTransactions, loading, error, lastResult } = useProcessTransactions();

  useEffect(() => {
    const newAmounts = { ...amounts };
    let changed = false;

    selectedPersons.forEach(person => {
      if (newAmounts[person.id] === undefined) {
        newAmounts[person.id] = TRANSACTION_CONFIG.DEFAULT_AMOUNT;
        changed = true;
      }
    });

    // Remove amounts for persons no longer selected
    Object.keys(newAmounts).forEach(id => {
      if (!selectedPersons.some(person => person.id === Number(id))) {
        delete newAmounts[Number(id)];
        changed = true;
      }
    });

    if (changed) {
      setAmounts(newAmounts);
    }
  }, [amounts, selectedPersons, setAmounts]);

  const handleAmountChange = (id: number, amount: number) => {
    setAmounts({
      ...amounts,
      [id]: amount
    });
  };

  const handleConfirm = async () => {
    try {
      const transactions = selectedPersons
        .filter(person => amounts[person.id] > 0)
        .map(person => ({
          personId: person.id,
          amount: amounts[person.id]
        }));
      
      if (transactions.length === 0) return;
      
      const result = await processTransactions(transactions);
      onTransactionsProcessed(result); // Pass result up

    } catch (err) {
      console.error('Transaction processing error:', err);
    }
  };

  const totalAmount = selectedPersons.reduce((sum, person) => sum + (amounts[person.id] || 0), 0);

  const anyInvalid = selectedPersons.some(person => {
    const amount = amounts[person.id] || 0;
    const balance = Number(person.balance) || 0;
    return amount <= 0 || amount > balance;
  });

  return (
    <SectionCard className="flex flex-col">
      <SectionHeader icon={DollarSign} title="Transaction Builder" iconColor="text-green-600" />
      <SectionSubtitle>Configure transaction amounts and process them</SectionSubtitle>
      
      {(lastResult || error) && (
        <TransactionStatus
          successful={lastResult?.summary.completed || 0}
          failed={lastResult?.summary.failed || 0}
          time={lastResult?.summary.processingTime || 0}
          status={error ? 'error' : 'completed'}
          showTrend={false}
        />
      )}
      
      {selectedPersons.length === 0 ? (
        <EmptyState 
          title="No transactions selected"
          subtitle="Select persons from the list to add transactions"
        />
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto flex-1">
            {selectedPersons.map(person => {
              const amount = amounts[person.id] || 0;
              const balance = Number(person.balance) || 0;
              const invalid = amount <= 0 || amount > balance;
              return (
                <div key={person.id} className="flex items-center justify-between">
                  <TransactionAccountItem
                    id={person.id}
                    name={person.name}
                    amount={amount}
                    balance={balance}
                    invalid={invalid}
                    onAmountChange={(amount) => handleAmountChange(person.id, amount)}
                  />
                  <button
                    onClick={() => onRemovePerson(person.id)}
                    className="text-gray-400 hover:text-red-700 mr-9"
                    title="Remove person"
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <PrimaryButton 
              onClick={handleConfirm}
              disabled={loading || totalAmount <= 0 || anyInvalid}
              loading={loading}
              fullWidth
            >
              Confirm Transaction
            </PrimaryButton>
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default TransactionBuilder;
