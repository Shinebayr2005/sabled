import React, { useState, createContext, useContext, useId } from 'react';

type RadioGroupOrientation = 'horizontal' | 'vertical';
type RadioGroupSize = 'sm' | 'md' | 'lg';
type RadioGroupColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type RadioGroupVariant = 'solid' | 'bordered' | 'light';

interface RadioGroupContextType {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  size?: RadioGroupSize;
  color?: RadioGroupColor;
  variant?: RadioGroupVariant;
  disabled?: boolean;
  isInvalid?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('useRadioGroup must be used within RadioGroup');
  }
  return context;
};

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: RadioGroupOrientation;
  size?: RadioGroupSize;
  color?: RadioGroupColor;
  variant?: RadioGroupVariant;
  disabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  value,
  defaultValue,
  onChange,
  name,
  orientation = 'vertical',
  size = 'md',
  color = 'primary',
  variant = 'solid',
  disabled = false,
  isInvalid = false,
  isRequired = false,
  label,
  description,
  errorMessage,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const groupId = useId();
  const groupName = name || `radio-group-${groupId}`;
  
  // Determine current value (controlled vs uncontrolled)
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const contextValue: RadioGroupContextType = {
    value: currentValue,
    onChange: handleChange,
    name: groupName,
    size,
    color,
    variant,
    disabled,
    isInvalid
  };

  const orientationClasses = {
    horizontal: 'flex flex-row flex-wrap gap-4',
    vertical: 'flex flex-col gap-2'
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>
        {/* Group Label */}
        {label && (
          <div className="mb-3">
            <label 
              className={`block text-sm font-medium transition-colors duration-200 ${
                isInvalid ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Radio Options */}
        <div 
          className={orientationClasses[orientation]} 
          role="radiogroup" 
          aria-label={label}
          aria-required={isRequired}
          aria-invalid={isInvalid}
          aria-describedby={errorMessage ? `${groupName}-error` : undefined}
        >
          {children}
        </div>

        {/* Error Message */}
        {isInvalid && errorMessage && (
          <p 
            id={`${groupName}-error`}
            className="mt-2 text-xs text-red-600 transition-colors duration-200"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;