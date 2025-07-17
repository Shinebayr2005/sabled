import React, { forwardRef } from 'react';

type RadioSize = 'sm' | 'md' | 'lg';
type RadioColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type RadioVariant = 'solid' | 'bordered' | 'light';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: RadioSize;
  color?: RadioColor;
  variant?: RadioVariant;
  label?: string;
  description?: string;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  size = 'md',
  color = 'primary',
  variant = 'solid',
  label,
  description,
  error = false,
  helperText,
  errorText,
  isInvalid = false,
  className = '',
  disabled = false,
  checked,
  ...props
}, ref) => {
  const finalError = error || isInvalid;
  
  const getSizeClasses = () => {
    const sizeMap = {
      sm: {
        radio: 'w-4 h-4',
        text: 'text-sm',
        spacing: 'ml-2',
        helper: 'ml-6',
        dot: 'w-2 h-2'
      },
      md: {
        radio: 'w-5 h-5',
        text: 'text-sm',
        spacing: 'ml-3',
        helper: 'ml-8',
        dot: 'w-2.5 h-2.5'
      },
      lg: {
        radio: 'w-6 h-6',
        text: 'text-base',
        spacing: 'ml-3',
        helper: 'ml-9',
        dot: 'w-3 h-3'
      }
    };
    return sizeMap[size];
  };

  const getColorClasses = () => {
    const baseColor = finalError ? 'danger' : color;
    
    const colorMap = {
      default: {
        solid: 'border-gray-300 data-[checked]:bg-gray-600 data-[checked]:border-gray-600',
        bordered: 'border-gray-300 data-[checked]:border-gray-600',
        light: 'border-gray-300 bg-gray-50 data-[checked]:bg-gray-100 data-[checked]:border-gray-400',
        dot: 'bg-white',
        focus: 'focus:ring-gray-500/20'
      },
      primary: {
        solid: 'border-gray-300 data-[checked]:bg-primary data-[checked]:border-primary',
        bordered: 'border-gray-300 data-[checked]:border-primary',
        light: 'border-gray-300 bg-primary/5 data-[checked]:bg-primary/10 data-[checked]:border-primary',
        dot: 'bg-white data-[variant="bordered"]:bg-primary data-[variant="light"]:bg-primary',
        focus: 'focus:ring-primary/20'
      },
      secondary: {
        solid: 'border-gray-300 data-[checked]:bg-secondary data-[checked]:border-secondary',
        bordered: 'border-gray-300 data-[checked]:border-secondary',
        light: 'border-gray-300 bg-secondary/5 data-[checked]:bg-secondary/10 data-[checked]:border-secondary',
        dot: 'bg-white data-[variant="bordered"]:bg-secondary data-[variant="light"]:bg-secondary',
        focus: 'focus:ring-secondary/20'
      },
      success: {
        solid: 'border-gray-300 data-[checked]:bg-green-600 data-[checked]:border-green-600',
        bordered: 'border-gray-300 data-[checked]:border-green-600',
        light: 'border-gray-300 bg-green-50 data-[checked]:bg-green-100 data-[checked]:border-green-400',
        dot: 'bg-white data-[variant="bordered"]:bg-green-600 data-[variant="light"]:bg-green-600',
        focus: 'focus:ring-green-500/20'
      },
      warning: {
        solid: 'border-gray-300 data-[checked]:bg-yellow-500 data-[checked]:border-yellow-500',
        bordered: 'border-gray-300 data-[checked]:border-yellow-500',
        light: 'border-gray-300 bg-yellow-50 data-[checked]:bg-yellow-100 data-[checked]:border-yellow-400',
        dot: 'bg-white data-[variant="bordered"]:bg-yellow-500 data-[variant="light"]:bg-yellow-500',
        focus: 'focus:ring-yellow-500/20'
      },
      danger: {
        solid: 'border-red-300 data-[checked]:bg-red-600 data-[checked]:border-red-600',
        bordered: 'border-red-300 data-[checked]:border-red-600',
        light: 'border-red-300 bg-red-50 data-[checked]:bg-red-100 data-[checked]:border-red-400',
        dot: 'bg-white data-[variant="bordered"]:bg-red-600 data-[variant="light"]:bg-red-600',
        focus: 'focus:ring-red-500/20'
      }
    };

    return colorMap[baseColor];
  };

  const sizeClasses = getSizeClasses();
  const colorClasses = getColorClasses();
  const helperColor = finalError ? 'text-red-600' : 'text-gray-500';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-start">
        <div className="relative flex items-center">
          {/* Hidden native radio */}
          <input
            ref={ref}
            type="radio"
            className="sr-only peer"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          
          {/* Custom radio */}
          <div
            className={`
              ${sizeClasses.radio}
              ${colorClasses[variant]}
              ${colorClasses.focus}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              border-2 rounded-full
              transition-all duration-200 ease-in-out
              peer-checked:scale-105
              hover:scale-105 active:scale-95
              flex items-center justify-center
              relative overflow-hidden
            `}
            data-checked={checked}
            data-variant={variant}
          >
            {/* Inner dot */}
            <div
              className={`
                ${sizeClasses.dot}
                ${colorClasses.dot}
                rounded-full
                transition-all duration-200 ease-in-out
                ${checked 
                  ? 'scale-100 opacity-100' 
                  : 'scale-0 opacity-0'
                }
              `}
              data-variant={variant}
            />
            
            {/* Ripple effect */}
            <div
              className={`
                absolute inset-0 rounded-full
                transition-all duration-300 ease-out
                ${checked 
                  ? 'scale-150 opacity-0' 
                  : 'scale-100 opacity-0'
                }
                ${variant === 'solid' 
                  ? 'bg-white/30' 
                  : variant === 'bordered'
                  ? colorClasses.dot.split(' ')[2] ? 'bg-current/20' : 'bg-gray-500/20'
                  : 'bg-current/20'
                }
              `}
            />
          </div>
        </div>
        
        {(label || description) && (
          <div className={sizeClasses.spacing}>
            {label && (
              <label 
                className={`
                  ${sizeClasses.text} font-medium cursor-pointer
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${finalError ? 'text-red-600' : 'text-gray-700'}
                  transition-colors duration-200
                  block
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={`text-xs text-gray-500 mt-0.5 ${disabled ? 'opacity-50' : ''}`}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p className={`mt-1 text-xs ${helperColor} ${label ? sizeClasses.helper : ''} transition-colors duration-200`}>
          {finalError && errorText ? errorText : helperText}
        </p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
