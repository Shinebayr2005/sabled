import React, { forwardRef, useState } from 'react';

export type TextareaVariant = 'flat' | 'faded' | 'bordered' | 'underlined';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type TextareaRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  color?: TextareaColor;
  radius?: TextareaRadius;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCharCount?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
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
  fullWidth = false,
  resize = 'vertical',
  maxLength,
  showCharCount = false,
  minRows = 3,
  maxRows,
  className = '',
  value,
  onChange,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const currentValue = value !== undefined ? value : internalValue;
  const charCount = typeof currentValue === 'string' ? currentValue.length : 0;
  const showError = isInvalid && errorMessage;
  const currentColor = isInvalid ? 'danger' : color;

  const sizeClasses = {
    sm: {
      textarea: 'px-3 py-2 text-sm min-h-[60px]',
      label: 'text-xs',
      description: 'text-xs mt-1'
    },
    md: {
      textarea: 'px-3 py-2.5 text-sm min-h-[80px]',
      label: 'text-sm',
      description: 'text-sm mt-1.5'
    },
    lg: {
      textarea: 'px-4 py-3 text-base min-h-[100px]',
      label: 'text-base',
      description: 'text-sm mt-2'
    }
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const textareaClasses = `
    w-full
    font-medium
    placeholder-gray-500
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    read-only:cursor-default
    ${sizeClasses[size].textarea}
    ${variant !== 'underlined' ? radiusClasses[radius] : ''}
    ${colorClasses[currentColor][variant]}
    ${focusRingClasses[currentColor]}
    ${resizeClasses[resize]}
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
      
      <textarea
        ref={ref}
        value={currentValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        rows={minRows}
        maxLength={maxLength}
        className={textareaClasses}
        style={{
          maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined
        }}
        {...props}
      />
      
      <div className="flex justify-between items-start mt-1.5">
        <div className={`${sizeClasses[size].description} ${showError ? 'text-red-600' : 'text-gray-500'}`}>
          {showError ? errorMessage : description}
        </div>
        {showCharCount && maxLength && (
          <div className={`text-sm ${charCount > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
