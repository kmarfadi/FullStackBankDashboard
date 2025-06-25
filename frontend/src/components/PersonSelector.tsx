/**
 * Component for selecting persons and specifying transaction amounts
 */
import { Person, TransactionRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, DollarSign } from 'lucide-react';

interface PersonSelectorProps {
  persons: Person[];
  selectedTransactions: TransactionRequest[];
  onTransactionChange: (transactions: TransactionRequest[]) => void;
}

/**
 * Person selector component with amount input for each person
 */
export default function PersonSelector({ 
  persons, 
  selectedTransactions, 
  onTransactionChange 
}: PersonSelectorProps) {
  
  /**
   * Handle person selection toggle
   */
  const handlePersonToggle = (personId: number, checked: boolean) => {
    if (checked) {
      // Add person with default amount
      const newTransactions = [...selectedTransactions, { personId, amount: 0 }];
      onTransactionChange(newTransactions);
    } else {
      // Remove person
      const newTransactions = selectedTransactions.filter(t => t.personId !== personId);
      onTransactionChange(newTransactions);
    }
  };

  /**
   * Handle amount change for a specific person
   */
  const handleAmountChange = (personId: number, amount: number) => {
    const newTransactions = selectedTransactions.map(t =>
      t.personId === personId ? { ...t, amount } : t
    );
    onTransactionChange(newTransactions);
  };

  /**
   * Check if person is selected
   */
  const isPersonSelected = (personId: number) => {
    return selectedTransactions.some(t => t.personId === personId);
  };

  /**
   * Get amount for a person
   */
  const getPersonAmount = (personId: number) => {
    const transaction = selectedTransactions.find(t => t.personId === personId);
    return transaction?.amount || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Persons & Amounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {persons.map((person) => {
            const isSelected = isPersonSelected(person.id);
            const amount = getPersonAmount(person.id);
            
            return (
              <div
                key={person.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                  isSelected 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`person-${person.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handlePersonToggle(person.id, checked as boolean)
                    }
                  />
                  <div>
                    <Label 
                      htmlFor={`person-${person.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {person.name}
                    </Label>
                    {person.email && (
                      <span className="text-sm text-gray-500">{person.email}</span>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amount || ''}
                      onChange={(e) => handleAmountChange(person.id, parseFloat(e.target.value) || 0)}
                      className="w-24"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
