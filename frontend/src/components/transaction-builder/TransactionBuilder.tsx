import React, { useEffect } from 'react';
import { DollarSign, X } from 'lucide-react';
import TransactionStatus from '@/components/transaction-builder/TransactionStatus';
import TransactionAccountItem from '@/components/transaction-builder/TransactionAccountItem';
import { useProcessTransactions } from '@/hooks/useApi';
import { TransactionBuilderProps } from '@/types';

const TransactionBuilder: React.FC<TransactionBuilderProps> = ({
  selectedPersons,
  onTransactionsProcessed,
  onRemovePerson,
  amounts,
  setAmounts
}) => {
  const { processTransactions, loading, error, lastResult } = useProcessTransactions();

  // Reset amounts when selected persons change
  useEffect(() => {
    // Set amount to 10 for new persons, keep existing for already selected
    const newAmounts = { ...amounts };
    let changed = false;

    selectedPersons.forEach(person => {
      if (newAmounts[person.id] === undefined) {
        newAmounts[person.id] = 10;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPersons]);

  const handleAmountChange = (id: number, amount: number) => {
    setAmounts({
      ...amounts,
      [id]: amount
    });
  };

  const handleConfirm = async () => {
    try {
      // Format transactions for API
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

  // Calculate total amount
  const totalAmount = selectedPersons.reduce((sum, person) => sum + (amounts[person.id] || 0), 0);

  // Extract failed transaction errors from lastResult
  const failedErrors =
    lastResult?.summary.details
      ?.filter((d) => d.status === 'failed' && typeof d.error === 'string' && d.error.length > 0)
      .map((d) => ({ index: d.index, error: d.error! })) || [];

  const anyInvalid = selectedPersons.some(person => {
    const amount = amounts[person.id] || 0;
    const balance = Number(person.balance) || 0;
    return amount <= 0 || amount > balance;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="text-green-600" size={20} />
        <h3 className="font-semibold text-gray-900">Transaction Builder</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Configure transaction amounts and process them
      </p>
      {/* Processing Status */}
      {(lastResult || error) && (
        <TransactionStatus
          successful={lastResult?.summary.completed || 0}
          failed={lastResult?.summary.failed || 0}
          time={lastResult?.summary.processingTime || 0}
          errors={failedErrors}
          generalError={error}
        />
      )}
      {/* Main Content */}
      {selectedPersons.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions selected</p>
          <p className="text-sm mt-1">Select persons from the list to add transactions</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
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
                    className="text-gray-400 hover:text-red-700 mr-2"
                    title="Remove person"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleConfirm}
              disabled={loading || totalAmount <= 0 || anyInvalid}
              className={`w-full py-2 font-medium rounded text-sm ${
                loading || totalAmount <= 0 || anyInvalid
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Processing...' : 'Add Transaction'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionBuilder;
