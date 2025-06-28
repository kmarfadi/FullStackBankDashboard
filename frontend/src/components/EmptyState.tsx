import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`text-center py-8 text-gray-500 ${className}`}>
      <p>{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
};

export default EmptyState; 