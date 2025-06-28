import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  color?: 'default' | 'primary' | 'danger' | 'success';
  label?: string;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error = false,
  size = 'medium',
  variant = 'outlined',
  color = 'default',
  label,
  helperText,
  errorText,
  fullWidth = false,
  searchable = false,
  clearable = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg'
  };

  const getColorClasses = () => {
    const baseColor = error ? 'danger' : color;
    
    const colorMap = {
      default: {
        outlined: `border-gray-300 focus:border-gray-500 focus:ring-gray-500/20`,
        filled: `bg-gray-100 focus:bg-gray-50 border-gray-300`,
        standard: `border-b-gray-300 focus:border-b-gray-500`
      },
      primary: {
        outlined: `border-gray-300 focus:border-primary focus:ring-primary/20`,
        filled: `bg-gray-100 focus:bg-gray-50 border-gray-300 focus:border-primary`,
        standard: `border-b-gray-300 focus:border-b-primary`
      },
      danger: {
        outlined: `border-red-300 focus:border-red-500 focus:ring-red-500/20`,
        filled: `bg-red-50 focus:bg-red-25 border-red-300`,
        standard: `border-b-red-300 focus:border-b-red-500`
      },
      success: {
        outlined: `border-green-300 focus:border-green-500 focus:ring-green-500/20`,
        filled: `bg-green-50 focus:bg-green-25 border-green-300`,
        standard: `border-b-green-300 focus:border-b-green-500`
      }
    };

    return colorMap[baseColor][variant];
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-in-out';
    
    switch (variant) {
      case 'outlined':
        return `${baseClasses} border rounded-md focus:ring-2 focus:ring-opacity-20`;
      case 'filled':
        return `${baseClasses} border border-transparent rounded-md focus:ring-2 focus:ring-opacity-20`;
      case 'standard':
        return `${baseClasses} border-0 border-b-2 rounded-none bg-transparent focus:ring-0`;
      default:
        return baseClasses;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(optionValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue('');
    onChange?.('');
  };

  const labelColor = error ? 'text-red-600' : focused ? (color === 'primary' ? 'text-primary' : 'text-gray-700') : 'text-gray-600';
  const helperColor = error ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`} ref={selectRef}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${labelColor} transition-colors duration-200`}>
          {label}
        </label>
      )}
      
      <div
        className={`
          ${sizeClasses[size]}
          ${getVariantClasses()}
          ${getColorClasses()}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          ${fullWidth ? 'w-full' : ''}
          flex items-center justify-between
          outline-none
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className="flex items-center gap-2">
          {clearable && selectedValue && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}
          
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No options found</div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`
                  px-4 py-3 cursor-pointer transition-colors duration-150
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                  ${selectedValue === option.value ? 'bg-primary/10 text-primary' : 'text-gray-900'}
                `}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      
      {(helperText || errorText) && (
        <p className={`mt-1 text-sm ${helperColor}`}>
          {error && errorText ? errorText : helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
