import AccountItem from './AccountItem';
import { Users } from 'lucide-react';
import { AvailableAccountsProps } from '@/types';
import { SectionCard, SectionHeader, SectionSubtitle, EmptyState } from '@/components/index';

const AvailableAccounts: React.FC<AvailableAccountsProps> = ({
  accounts,
  onAddTransaction = () => {},
}) => {
  return (
    <SectionCard background="slate-50" className="h-full">
      <SectionHeader icon={Users} title="Available Accounts" iconColor="text-blue-600" />
      <SectionSubtitle>Click to add Accounts to your transaction list</SectionSubtitle>

      <div className="space-y-2 overflow-y-auto max-h-80 mt-2">
        {Array.isArray(accounts) && accounts.length > 0 ? (
          accounts.map(person => (
            <AccountItem
              key={person.id}
              id={person.id}
              name={person.name}
              joinDate={person.createdAt ?? ''}
              balance={Number(person.balance)}
              onAddTransaction={() => onAddTransaction(person)}
            />
          ))
        ) : (
          <EmptyState 
            title="No accounts available" 
            className="py-4"
          />
        )}
      </div>
    </SectionCard>
  );
};

export default AvailableAccounts;