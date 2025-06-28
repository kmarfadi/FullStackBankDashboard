import React from 'react';

interface ItemCardHeaderProps {
  name: string;
  value?: number | string;
  valueColor?: string;
  className?: string;
}

const ItemCardHeader: React.FC<ItemCardHeaderProps> = ({
  name,
  value,
  valueColor = 'text-gray-900',
  className = '',
}) => (
  <div className={`flex justify-between items-center mb-1 ${className}`}>
    <h4 className="font-sm text-gray-800">{name}</h4>
    {value !== undefined && value !== null && (
      <span className={`font-semibold ${valueColor}`}>
        {`$${typeof value === 'number' ? value.toFixed(2) : value}`}
      </span>
    )}
  </div>
);

export default ItemCardHeader; 