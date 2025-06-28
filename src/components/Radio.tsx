import React, { forwardRef } from 'react';

type RadioSize = 'small' | 'medium' | 'large';
type RadioColor = 'default' | 'primary' | 'danger' | 'success';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: RadioSize;
  color?: RadioColor;
  label?: string;
  error?: boolean;
  helperText?: string;
  errorText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  size = 'medium',
  color = 'primary',
  label,
  error = false,
  helperText,
  errorText,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const getColorClasses = () => {
    const baseColor = error ? 'danger' : color;
    
    const colorMap = {
      default: 'text-gray-600 focus:ring-gray-500/20 border-gray-300',
      primary: 'text-primary focus:ring-primary/20 border-gray-300',
      danger: 'text-red-500 focus:ring-red-500/20 border-red-300',
      success: 'text-green-500 focus:ring-green-500/20 border-green-300'
    };

    return colorMap[baseColor];
  };

  const helperColor = error ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="flex flex-col">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            className={`
              ${sizeClasses[size]}
              ${getColorClasses()}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              border-2 focus:ring-2 focus:ring-opacity-20 transition-all duration-200
              ${className}
            `}
            disabled={disabled}
            {...props}
          />
        </div>
        
        {label && (
          <div className="ml-3">
            <label 
              className={`
                text-sm font-medium cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${error ? 'text-red-600' : 'text-gray-700'}
              `}
            >
              {label}
            </label>
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p className={`mt-1 text-sm ${helperColor} ${label ? 'ml-8' : ''}`}>
          {error && errorText ? errorText : helperText}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
