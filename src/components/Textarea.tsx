import React, { forwardRef, useState } from 'react';

type TextareaVariant = 'outlined' | 'filled' | 'standard';
type TextareaSize = 'small' | 'medium' | 'large';
type TextareaColor = 'default' | 'primary' | 'danger' | 'success';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  color?: TextareaColor;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'outlined',
  size = 'medium',
  color = 'default',
  label,
  helperText,
  error = false,
  errorText,
  fullWidth = false,
  resize = 'vertical',
  maxLength,
  showCharCount = false,
  className = '',
  disabled = false,
  value,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const charCount = typeof value === 'string' ? value.length : 0;

  const sizeClasses = {
    small: 'px-3 py-2 text-sm min-h-[80px]',
    medium: 'px-4 py-3 text-base min-h-[100px]',
    large: 'px-5 py-4 text-lg min-h-[120px]'
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
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

  const labelColor = error ? 'text-red-600' : focused ? (color === 'primary' ? 'text-primary' : 'text-gray-700') : 'text-gray-600';
  const helperColor = error ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${labelColor} transition-colors duration-200`}>
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={`
          ${sizeClasses[size]}
          ${getVariantClasses()}
          ${getColorClasses()}
          ${resizeClasses[resize]}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          ${fullWidth ? 'w-full' : ''}
          outline-none
          ${className}
        `}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      
      <div className="flex justify-between items-center mt-1">
        {(helperText || errorText) && (
          <p className={`text-sm ${helperColor}`}>
            {error && errorText ? errorText : helperText}
          </p>
        )}
        
        {showCharCount && (
          <p className={`text-sm ${helperColor} ml-auto`}>
            {charCount}{maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
