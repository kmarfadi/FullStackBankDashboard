import React from 'react';

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  spacing = 'md',
}) => {
  const spacingClasses = {
    none: '',
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-4',
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

export default CardContent; 