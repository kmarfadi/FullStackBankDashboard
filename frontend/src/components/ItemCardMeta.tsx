import React from 'react';

interface ItemCardMetaProps {
  subtitle?: string;
  statusText?: string;
  statusColor?: string;
  className?: string;
}

const ItemCardMeta: React.FC<ItemCardMetaProps> = ({
  subtitle,
  statusText,
  statusColor = 'text-green-600',
  className = '',
}) => {
  if (!subtitle && !statusText) return null;
  return (
    <div className={`flex items-center justify-between text-xs text-gray-500 mb-2 ${className}`}>
      {subtitle && <div>{subtitle}</div>}
      {statusText && (
        <div className="flex items-center gap-1">
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
  );
};

export default ItemCardMeta; 