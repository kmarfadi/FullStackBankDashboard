import ItemCard from '@/ui/ItemCard';
import { AccountItemProps } from '@/types';

const AccountItem: React.FC<AccountItemProps> = ({
  id,
  name,
  joinDate,
  balance,
  onAddTransaction
}) => {

  const formattedDate = new Date(joinDate).toLocaleDateString() 
  const joinedPhrase = `Joined on ${formattedDate}`;
  
  return (
    <ItemCard
      name={name}
      value={balance}
      valueColor="text-green-700"
      subtitle={joinedPhrase}
      buttonText="Add Transaction"
      onButtonClick={() => onAddTransaction(id)}
    />
  );
};

export default AccountItem;
