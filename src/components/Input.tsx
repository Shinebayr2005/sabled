import React, { forwardRef, useState } from 'react';

export type InputVariant = 'flat' | 'faded' | 'bordered' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type InputRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  color?: InputColor;
  radius?: InputRadius;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
  clearable?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'flat',
  size = 'md',
  color = 'default',
  radius = 'md',
  label,
  description,
  errorMessage,
  isInvalid = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  startContent,
  endContent,
  fullWidth = false,
  clearable = false,
  className = '',
  value,
  onChange,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = Boolean(currentValue);
  const showError = isInvalid && errorMessage;
  const currentColor = isInvalid ? 'danger' : color;

  const sizeClasses = {
    sm: {
      input: 'px-3 py-1.5 text-sm min-h-8',
      label: 'text-xs',
      description: 'text-xs mt-1',
      content: 'text-sm'
    },
    md: {
      input: 'px-3 py-2 text-sm min-h-10',
      label: 'text-sm',
      description: 'text-sm mt-1.5',
      content: 'text-sm'
    },
    lg: {
      input: 'px-4 py-3 text-base min-h-12',
      label: 'text-base',
      description: 'text-sm mt-2',
      content: 'text-base'
    }
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const colorClasses = {
    default: {
      flat: `bg-gray-100 hover:bg-gray-200 ${focused ? 'bg-white border-gray-400' : 'border-transparent'}`,
      faded: `bg-gray-50 border ${focused ? 'border-gray-400 bg-white' : 'border-gray-200'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-gray-400' : 'border-gray-300'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-gray-400' : 'border-gray-300'}`
    },
    primary: {
      flat: `bg-primary/5 hover:bg-primary/10 ${focused ? 'bg-white border-primary' : 'border-transparent'}`,
      faded: `bg-primary/5 border ${focused ? 'border-primary bg-white' : 'border-primary/20'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-primary' : 'border-primary/30'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-primary' : 'border-primary/30'}`
    },
    secondary: {
      flat: `bg-purple-50 hover:bg-purple-100 ${focused ? 'bg-white border-purple-500' : 'border-transparent'}`,
      faded: `bg-purple-25 border ${focused ? 'border-purple-500 bg-white' : 'border-purple-200'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-purple-500' : 'border-purple-300'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-purple-500' : 'border-purple-300'}`
    },
    success: {
      flat: `bg-green-50 hover:bg-green-100 ${focused ? 'bg-white border-green-500' : 'border-transparent'}`,
      faded: `bg-green-25 border ${focused ? 'border-green-500 bg-white' : 'border-green-200'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-green-500' : 'border-green-300'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-green-500' : 'border-green-300'}`
    },
    warning: {
      flat: `bg-yellow-50 hover:bg-yellow-100 ${focused ? 'bg-white border-yellow-500' : 'border-transparent'}`,
      faded: `bg-yellow-25 border ${focused ? 'border-yellow-500 bg-white' : 'border-yellow-200'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-yellow-500' : 'border-yellow-300'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-yellow-500' : 'border-yellow-300'}`
    },
    danger: {
      flat: `bg-red-50 hover:bg-red-100 ${focused ? 'bg-white border-red-500' : 'border-transparent'}`,
      faded: `bg-red-25 border ${focused ? 'border-red-500 bg-white' : 'border-red-200'}`,
      bordered: `bg-transparent border-2 ${focused ? 'border-red-500' : 'border-red-300'}`,
      underlined: `bg-transparent border-b-2 rounded-none ${focused ? 'border-red-500' : 'border-red-300'}`
    }
  };

  const focusRingClasses = {
    default: 'focus:ring-gray-500/20',
    primary: 'focus:ring-primary/20',
    secondary: 'focus:ring-purple-500/20',
    success: 'focus:ring-green-500/20',
    warning: 'focus:ring-yellow-500/20',
    danger: 'focus:ring-red-500/20'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleClear = () => {
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    
    if (value === undefined) {
      setInternalValue('');
    }
    if (onChange) {
      onChange(event);
    }
  };

  const inputClasses = `
    w-full
    font-medium
    placeholder-gray-500
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    read-only:cursor-default
    ${sizeClasses[size].input}
    ${variant !== 'underlined' ? radiusClasses[radius] : ''}
    ${colorClasses[currentColor][variant]}
    ${focusRingClasses[currentColor]}
  `.replace(/\s+/g, ' ').trim();

  const labelClasses = `
    block font-medium mb-1.5
    ${sizeClasses[size].label}
    ${isInvalid ? 'text-red-600' : 'text-gray-700'}
    ${isRequired ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {startContent && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${sizeClasses[size].content} text-gray-500 pointer-events-none`}>
            {startContent}
          </div>
        )}
        
        <input
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          className={`
            ${inputClasses}
            ${startContent ? 'pl-10' : ''}
            ${(endContent || (clearable && hasValue)) ? 'pr-10' : ''}
          `.replace(/\s+/g, ' ').trim()}
          {...props}
        />
        
        {(endContent || (clearable && hasValue && !isDisabled && !isReadOnly)) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {clearable && hasValue && !isDisabled && !isReadOnly && (
              <button
                type="button"
                onClick={handleClear}
                className={`${sizeClasses[size].content} text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            {endContent && (
              <div className={`${sizeClasses[size].content} text-gray-500`}>
                {endContent}
              </div>
            )}
          </div>
        )}
      </div>
      
      {(description || showError) && (
        <div className={`${sizeClasses[size].description} ${showError ? 'text-red-600' : 'text-gray-500'}`}>
          {showError ? errorMessage : description}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
