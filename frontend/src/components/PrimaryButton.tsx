import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-400',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const cursorClass = disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${cursorClass}
        ${className}
      `.trim()}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default PrimaryButton; 