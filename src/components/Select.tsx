import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
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
  variant?: 'outlined' | 'filled' | 'standard' | 'ghost';
  color?: 'default' | 'primary' | 'danger' | 'success' | 'warning';
  label?: string;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  maxHeight?: number;
  dropdownWidth?: 'auto' | 'full' | number | string;
  placement?: 'bottom' | 'top' | 'auto';
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  noOptionsText?: string;
  className?: string;
  dropdownClassName?: string;
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
  dropdownWidth = 'auto',
  placement = 'auto',
  renderOption,
  noOptionsText = 'No options found',
  className = '',
  dropdownClassName = '',
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
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

  // Display value for the select with better truncation
  const displayValue = useMemo(() => {
    if (multiple && Array.isArray(selectedOption)) {
      if (selectedOption.length === 0) return '';
      if (selectedOption.length === 1) return selectedOption[0].label;
      if (selectedOption.length === 2) return `${selectedOption[0].label}, ${selectedOption[1].label}`;
      return `${selectedOption[0].label} and ${selectedOption.length - 1} others`;
    }
    return selectedOption ? (selectedOption as SelectOption).label : '';
  }, [selectedOption, multiple]);

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[36px]',
    medium: 'px-4 py-3 text-base min-h-[44px]',
    large: 'px-5 py-4 text-lg min-h-[52px]'
  };

  const getColorClasses = () => {
    const baseColor = error ? 'danger' : color;
    
    const colorMap = {
      default: {
        outlined: `border-gray-300 focus:border-gray-500 focus:ring-gray-500/20`,
        filled: `bg-gray-100 focus:bg-gray-50 border-gray-300`,
        standard: `border-b-gray-300 focus:border-b-gray-500`,
        ghost: `border-transparent focus:border-gray-300 focus:ring-gray-500/20`
      },
      primary: {
        outlined: `border-gray-300 focus:border-blue-500 focus:ring-blue-500/20`,
        filled: `bg-blue-50 focus:bg-blue-25 border-blue-200 focus:border-blue-500`,
        standard: `border-b-gray-300 focus:border-b-blue-500`,
        ghost: `border-transparent focus:border-blue-300 focus:ring-blue-500/20`
      },
      danger: {
        outlined: `border-red-300 focus:border-red-500 focus:ring-red-500/20`,
        filled: `bg-red-50 focus:bg-red-25 border-red-300`,
        standard: `border-b-red-300 focus:border-b-red-500`,
        ghost: `border-transparent focus:border-red-300 focus:ring-red-500/20`
      },
      success: {
        outlined: `border-green-300 focus:border-green-500 focus:ring-green-500/20`,
        filled: `bg-green-50 focus:bg-green-25 border-green-300`,
        standard: `border-b-green-300 focus:border-b-green-500`,
        ghost: `border-transparent focus:border-green-300 focus:ring-green-500/20`
      },
      warning: {
        outlined: `border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20`,
        filled: `bg-yellow-50 focus:bg-yellow-25 border-yellow-300`,
        standard: `border-b-yellow-300 focus:border-b-yellow-500`,
        ghost: `border-transparent focus:border-yellow-300 focus:ring-yellow-500/20`
      }
    };

    return colorMap[baseColor][variant];
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-in-out';
    
    switch (variant) {
      case 'outlined':
        return `${baseClasses} border rounded-lg focus:ring-2 focus:ring-opacity-20 shadow-sm hover:shadow-md`;
      case 'filled':
        return `${baseClasses} border border-transparent rounded-lg focus:ring-2 focus:ring-opacity-20 shadow-sm`;
      case 'standard':
        return `${baseClasses} border-0 border-b-2 rounded-none bg-transparent focus:ring-0`;
      case 'ghost':
        return `${baseClasses} border rounded-lg focus:ring-2 focus:ring-opacity-20 bg-transparent hover:bg-gray-50`;
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

  // Calculate dropdown positioning and width
  const getDropdownStyles = () => {
    const styles: React.CSSProperties = { maxHeight };
    
    // Handle width
    if (dropdownWidth === 'auto') {
      styles.minWidth = '100%';
      styles.width = 'max-content';
      styles.maxWidth = '400px';
    } else if (dropdownWidth === 'full') {
      styles.width = '100%';
    } else if (typeof dropdownWidth === 'number') {
      styles.width = `${dropdownWidth}px`;
    } else if (typeof dropdownWidth === 'string') {
      styles.width = dropdownWidth;
    } else {
      styles.width = '100%';
    }
    
    return styles;
  };

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && selectRef.current && placement === 'auto') {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    } else if (placement !== 'auto') {
      setDropdownPosition(placement);
    }
  }, [isOpen, placement, maxHeight]);

  const labelColor = error ? 'text-red-600' : focused ? (color === 'primary' ? 'text-blue-600' : color === 'danger' ? 'text-red-600' : color === 'success' ? 'text-green-600' : color === 'warning' ? 'text-yellow-600' : 'text-gray-700') : 'text-gray-600';
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
        <span className={`flex-1 truncate ${displayValue ? 'text-gray-900' : 'text-gray-500'}`}>
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="truncate">Loading...</span>
            </div>
          ) : (
            <span className="truncate" title={displayValue}>
              {displayValue || placeholder}
            </span>
          )}
        </span>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {clearable && hasValue && !loading && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {clearable && hasValue && !loading && (
            <div className="w-px h-4 bg-gray-300"></div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center p-1">
              <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="p-1">
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute z-50 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} ${dropdownWidth === 'auto' ? 'left-0' : 'w-full'} bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm transform transition-all duration-200 ease-out ${
            isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95'
          } ${dropdownClassName}`}
          style={getDropdownStyles()}
          role="listbox"
          aria-multiselectable={multiple}
        >
          {searchable && (
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      handleKeyDown(e);
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ maxHeight: maxHeight - (searchable ? 70 : 0) }} ref={listRef}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 10-8 8 7.962 7.962 0 01-5.291-2z" />
                </svg>
                <p className="text-gray-500 text-sm">{noOptionsText}</p>
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = isOptionSelected(option.value);
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <div
                    key={option.value}
                    className={`
                      relative px-4 py-3 cursor-pointer transition-all duration-150 flex items-start gap-3 group
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'}
                      ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                      ${isHighlighted ? 'bg-gray-100' : ''}
                      ${isSelected ? 'border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
                    `}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                  >
                    {option.icon && (
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                        {option.icon}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm leading-5 break-words">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-gray-500 mt-1 leading-4 break-words">{option.description}</div>
                          )}
                        </div>
                        {multiple && isSelected && (
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {renderOption && (
                      <div className="flex-shrink-0">
                        {renderOption(option, isSelected)}
                      </div>
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
