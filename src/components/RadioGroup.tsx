import React, { useState, createContext, useContext, useId } from "react";

type RadioGroupOrientation = "horizontal" | "vertical";
type RadioGroupSize = "sm" | "md" | "lg";
type RadioGroupColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type RadioGroupVariant = "solid" | "bordered" | "light" | "ghost" | "flat";

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
    throw new Error("useRadioGroup must be used within RadioGroup");
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
  orientation = "vertical",
  size = "md",
  color = "primary",
  variant = "solid",
  disabled = false,
  isInvalid = false,
  isRequired = false,
  label,
  description,
  errorMessage,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
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
    isInvalid,
  };

  const orientationClasses = {
    horizontal: "flex flex-row flex-wrap gap-4",
    vertical: "flex flex-col gap-3",
  };

  const variantSpacing = {
    solid: "gap-3",
    bordered: "gap-3",
    light: "gap-2",
    ghost: "gap-2",
    flat: "gap-2",
  };

  // Focus ring classes matching Button component
  // const focusClasses = {
  //   default: "focus-within:ring-gray-500",
  //   primary: "focus-within:ring-primary",
  //   secondary: "focus-within:ring-secondary",
  //   success: "focus-within:ring-green-500",
  //   warning: "focus-within:ring-yellow-500",
  //   danger: "focus-within:ring-red-500",
  // };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={`w-full ${className}`}>
        {/* Group Label */}
        {label && (
          <div className="mb-4">
            <label
              className={`block text-sm font-semibold transition-colors duration-200 ${
                isInvalid ? "text-red-600" : "text-gray-800"
              }`}
            >
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Radio Options */}
        <div
          className={`
    ${orientationClasses[orientation]} 
    ${orientation === "vertical" ? variantSpacing[variant] : "gap-4"}
  `}
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
            className="mt-3 text-xs text-red-600 transition-colors duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
