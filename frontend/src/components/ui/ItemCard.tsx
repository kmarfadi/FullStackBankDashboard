import { ItemCardProps } from '@/types';
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
      {/* Name and Value */}
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-sm text-gray-800">{name}</h4>
        {value && <span className={`font-semibold ${valueColor}`}>
          ${typeof value === 'number' ? `${value.toFixed(2)}` : value}
        </span>}
      </div>
      
      {/* Subtitle and Status */}
      {(subtitle || statusText) && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {subtitle && <div>{subtitle}</div>}
          {statusText && (
            <div className="flex items-center gap-1">
              {/* Optional status icon */}
              {statusText === 'completed' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12l2 2 4-4"></path>
                </svg>
              )}
              <span className={statusColor}>{statusText}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Button */}
      {buttonText && (
        <button 
          onClick={onButtonClick}
          className="w-full mt-2 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ItemCard;