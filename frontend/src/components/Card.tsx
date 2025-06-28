import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'slate-50' | 'slate-100';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'lg' | 'xl';
  hover?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  background = 'white',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  border = false,
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    'slate-50': 'bg-slate-50',
    'slate-100': 'bg-slate-100',
  };

  const paddingClasses = {
    sm: 'p-2 md:p-3',
    md: 'p-3 md:p-4',
    lg: 'p-4 md:p-5',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const hoverClasses = hover ? 'transition-all hover:shadow-xl duration-300' : '';
  const borderClasses = border ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        rounded-lg
        h-full
        flex flex-col
        ${backgroundClasses[background]}
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${hoverClasses}
        ${borderClasses}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

export default Card; 