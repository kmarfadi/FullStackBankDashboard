import { PrimaryButton, ItemCardHeader, ItemCardMeta } from '@/components/index';

interface ItemCardProps {
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

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  value,
  valueColor = 'text-gray-900',
  subtitle,
  statusText,
  statusColor = 'text-green-600',
  buttonText,
  onButtonClick
}) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0 py-3 px-9 hover:bg-slate-100 transition-colors">
      <ItemCardHeader name={name} value={value} valueColor={valueColor} />
      <ItemCardMeta subtitle={subtitle} statusText={statusText} statusColor={statusColor} />
      {buttonText && (
        <PrimaryButton 
          onClick={onButtonClick}
          fullWidth
          size="sm"
          className="mt-2"
        >
          {buttonText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default ItemCard;