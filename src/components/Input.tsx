import React, { forwardRef, useState } from 'react';

type InputVariant = 'outlined' | 'filled' | 'standard';
type InputSize = 'small' | 'medium' | 'large';
type InputColor = 'default' | 'primary' | 'danger' | 'success';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  color?: InputColor;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'outlined',
  size = 'medium',
  color = 'default',
  label,
  helperText,
  error = false,
  errorText,
  startIcon,
  endIcon,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const sizeClasses = {
    small: 'px-3 py-2 text-sm h-9',
    medium: 'px-4 py-3 text-base h-11',
    large: 'px-5 py-4 text-lg h-14'
  };

  const getColorClasses = () => {
    const baseColor = error ? 'danger' : color;
    
    const colorMap = {
      default: {
        outlined: `border-gray-300 focus:border-gray-500 focus:ring-gray-500/20 shadow-sm hover:shadow-md focus:shadow-md`,
        filled: `bg-gray-100 focus:bg-white border-gray-300 focus:border-gray-500 shadow-sm`,
        standard: `border-b-gray-300 focus:border-b-gray-500 bg-transparent`
      },
      primary: {
        outlined: `border-gray-300 focus:border-primary focus:ring-primary/20 shadow-sm hover:shadow-md focus:shadow-md`,
        filled: `bg-gray-100 focus:bg-white border-gray-300 focus:border-primary shadow-sm`,
        standard: `border-b-gray-300 focus:border-b-primary bg-transparent`
      },
      danger: {
        outlined: `border-red-300 focus:border-red-500 focus:ring-red-500/20 shadow-sm hover:shadow-md focus:shadow-md`,
        filled: `bg-red-50 focus:bg-white border-red-300 focus:border-red-500 shadow-sm`,
        standard: `border-b-red-300 focus:border-b-red-500 bg-transparent`
      },
      success: {
        outlined: `border-green-300 focus:border-green-500 focus:ring-green-500/20 shadow-sm hover:shadow-md focus:shadow-md`,
        filled: `bg-green-50 focus:bg-white border-green-300 focus:border-green-500 shadow-sm`,
        standard: `border-b-green-300 focus:border-b-green-500 bg-transparent`
      }
    };

    return colorMap[baseColor][variant];
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-in-out';
    
    switch (variant) {
      case 'outlined':
        return `${baseClasses} border-2 rounded-lg focus:ring-2 focus:ring-opacity-20 placeholder:text-gray-400`;
      case 'filled':
        return `${baseClasses} border-2 border-transparent rounded-lg focus:ring-2 focus:ring-opacity-20 placeholder:text-gray-400`;
      case 'standard':
        return `${baseClasses} border-0 border-b-2 rounded-none bg-transparent focus:ring-0 placeholder:text-gray-400`;
      default:
        return baseClasses;
    }
  };

  const labelColor = error ? 'text-red-600' : focused ? (color === 'primary' ? 'text-primary' : 'text-gray-700') : 'text-gray-600';
  const helperColor = error ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${labelColor} transition-colors duration-200`}>
          {label}
        </label>
      )}
      
      <div className="relative group">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-gray-600">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            ${sizeClasses[size]}
            ${getVariantClasses()}
            ${getColorClasses()}
            ${startIcon ? 'pl-10' : ''}
            ${endIcon ? 'pr-10' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            ${fullWidth ? 'w-full' : ''}
            outline-none
            ${className}
          `}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-gray-600">
            {endIcon}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p className={`mt-1 text-sm ${helperColor}`}>
          {error && errorText ? errorText : helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
