import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
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
  multiple?: boolean;
  loading?: boolean;
  maxHeight?: number;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  noOptionsText?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
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
  multiple = false,
  loading = false,
  maxHeight = 240,
  renderOption,
  noOptionsText = 'No options found',
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) => {
  // Determine if component is controlled
  const isControlled = value !== undefined;
  
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(() => {
    if (multiple) {
      return (defaultValue as (string | number)[]) || [];
    }
    return defaultValue || '';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Get current value (controlled or uncontrolled)
  const currentValue = isControlled ? value : internalValue;

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchable, searchTerm]);

  // Get selected option(s)
  const selectedOption = useMemo(() => {
    if (multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      return options.filter(option => values.indexOf(option.value) !== -1);
    }
    return options.find(option => option.value === currentValue);
  }, [options, currentValue, multiple]);

  // Display value for the select
  const displayValue = useMemo(() => {
    if (multiple && Array.isArray(selectedOption)) {
      if (selectedOption.length === 0) return '';
      if (selectedOption.length === 1) return selectedOption[0].label;
      return `${selectedOption.length} items selected`;
    }
    return selectedOption ? (selectedOption as SelectOption).label : '';
  }, [selectedOption, multiple]);

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

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [disabled, isOpen, highlightedIndex, filteredOptions]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  // Update internal value when external value changes (controlled component)
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value || (multiple ? [] : ''));
    }
  }, [value, isControlled, multiple]);

  const handleSelect = useCallback((optionValue: string | number) => {
    let newValue: string | number | (string | number)[];
    
    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      const index = currentArray.indexOf(optionValue);
      
      if (index >= 0) {
        // Remove if already selected
        newValue = currentArray.filter((_, i) => i !== index);
      } else {
        // Add if not selected
        newValue = [...currentArray, optionValue];
      }
    } else {
      newValue = optionValue;
      setIsOpen(false);
    }
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    setSearchTerm('');
    setHighlightedIndex(-1);
    onChange?.(newValue);
  }, [currentValue, multiple, isControlled, onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = multiple ? [] : '';
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  }, [multiple, isControlled, onChange]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && searchable) {
        // Focus search input when opening
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [disabled, isOpen, searchable]);

  // Check if option is selected
  const isOptionSelected = useCallback((optionValue: string | number) => {
    if (multiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      return values.indexOf(optionValue) !== -1;
    }
    return currentValue === optionValue;
  }, [currentValue, multiple]);

  const hasValue = multiple 
    ? Array.isArray(currentValue) && currentValue.length > 0
    : Boolean(currentValue);

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
        onClick={handleToggle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        id={id}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
          {loading ? 'Loading...' : displayValue || placeholder}
        </span>
        
        <div className="flex items-center gap-2">
          {clearable && hasValue && !loading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {loading ? (
            <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden"
          style={{ maxHeight: maxHeight }}
          role="listbox"
          aria-multiselectable={multiple}
          ref={listRef}
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    handleKeyDown(e);
                  }
                }}
              />
            </div>
          )}
          
          <div className="overflow-auto" style={{ maxHeight: maxHeight - (searchable ? 60 : 0) }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-500">{noOptionsText}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = isOptionSelected(option.value);
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={option.value}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${isSelected ? 'bg-primary/10 text-primary' : 'text-gray-900'}
                      ${isHighlighted ? 'bg-gray-50' : ''}
                    `}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected)
                    ) : (
                      <>
                        <span>{option.label}</span>
                        {multiple && isSelected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
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
