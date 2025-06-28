import React from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0.00',
  min = 0,
  max,
  invalid = false,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'w-52 pl-6 pr-2 py-1 border rounded text-center transition-colors duration-200';
  const stateClasses = invalid 
    ? 'border-red-500 bg-red-50 text-red-700' 
    : 'border-gray-300';

  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`${baseClasses} ${stateClasses} ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  );
};

export default CurrencyInput; 