import React from 'react';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  align = 'left',
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={`flex items-center ${alignClasses[align]} mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardHeader; 