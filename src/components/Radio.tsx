import React, { forwardRef } from "react";
import { useRadioGroup } from "./RadioGroup";

type RadioSize = "sm" | "md" | "lg";
type RadioColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type RadioVariant = "solid" | "bordered" | "light";

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  value: string;
  children?: React.ReactNode;
  size?: RadioSize;
  color?: RadioColor;
  variant?: RadioVariant;
  description?: string;
  isDisabled?: boolean;
  className?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      children,
      size,
      color,
      variant,
      description,
      isDisabled,
      className = "",
      onChange,
      ...props
    },
    ref
  ) => {
    // Try to get context from RadioGroup
    let groupContext;
    try {
      groupContext = useRadioGroup();
    } catch {
      groupContext = null;
    }

    // Use group context or fallback to individual props
    const finalSize = size || groupContext?.size || "md";
    const finalColor = color || groupContext?.color || "primary";
    const finalVariant = variant || groupContext?.variant || "solid";
    const finalDisabled = isDisabled || groupContext?.disabled || false;
    const finalInvalid = groupContext?.isInvalid || false;

    // Determine if checked
    const isChecked = groupContext
      ? groupContext.value === value
      : props.checked || false;

    const getSizeClasses = () => {
      const sizeMap = {
        sm: {
          radio: "w-4 h-4",
          text: "text-sm",
          spacing: "ml-2",
          dot: "w-2 h-2",
        },
        md: {
          radio: "w-5 h-5",
          text: "text-sm",
          spacing: "ml-3",
          dot: "w-2.5 h-2.5",
        },
        lg: {
          radio: "w-6 h-6",
          text: "text-base",
          spacing: "ml-3",
          dot: "w-3 h-3",
        },
      };
      return sizeMap[finalSize];
    };

    const getColorClasses = () => {
      const baseColor = finalInvalid ? "danger" : finalColor;

      const colorMap = {
        default: {
          solid: `border-gray-300 transition-all duration-200 ${
            isChecked ? "bg-gray-600 border-gray-600" : "hover:border-gray-400"
          }`,
          bordered: `border-gray-300 transition-all duration-200 ${
            isChecked ? "border-gray-600 bg-gray-50" : "hover:border-gray-400"
          }`,
          light: `border-gray-300 bg-gray-50 transition-all duration-200 ${
            isChecked ? "bg-gray-100 border-gray-400" : "hover:bg-gray-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-gray-600"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20 focus-visible:ring-offset-2",
        },
        primary: {
          solid: `border-gray-300 transition-all duration-200 ${
            isChecked ? "bg-blue-600 border-blue-600" : "hover:border-blue-300"
          }`,
          bordered: `border-gray-300 transition-all duration-200 ${
            isChecked ? "border-blue-600 bg-blue-50" : "hover:border-blue-300"
          }`,
          light: `border-gray-300 bg-blue-50 transition-all duration-200 ${
            isChecked ? "bg-blue-100 border-blue-400" : "hover:bg-blue-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-blue-600"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2",
        },
        secondary: {
          solid: `border-gray-300 transition-all duration-200 ${
            isChecked ? "bg-purple-600 border-purple-600" : "hover:border-purple-300"
          }`,
          bordered: `border-gray-300 transition-all duration-200 ${
            isChecked ? "border-purple-600 bg-purple-50" : "hover:border-purple-300"
          }`,
          light: `border-gray-300 bg-purple-50 transition-all duration-200 ${
            isChecked ? "bg-purple-100 border-purple-400" : "hover:bg-purple-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-purple-600"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:ring-offset-2",
        },
        success: {
          solid: `border-gray-300 transition-all duration-200 ${
            isChecked ? "bg-green-600 border-green-600" : "hover:border-green-300"
          }`,
          bordered: `border-gray-300 transition-all duration-200 ${
            isChecked ? "border-green-600 bg-green-50" : "hover:border-green-300"
          }`,
          light: `border-gray-300 bg-green-50 transition-all duration-200 ${
            isChecked ? "bg-green-100 border-green-400" : "hover:bg-green-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-green-600"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:ring-offset-2",
        },
        warning: {
          solid: `border-gray-300 transition-all duration-200 ${
            isChecked ? "bg-yellow-500 border-yellow-500" : "hover:border-yellow-300"
          }`,
          bordered: `border-gray-300 transition-all duration-200 ${
            isChecked ? "border-yellow-500 bg-yellow-50" : "hover:border-yellow-300"
          }`,
          light: `border-gray-300 bg-yellow-50 transition-all duration-200 ${
            isChecked ? "bg-yellow-100 border-yellow-400" : "hover:bg-yellow-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-yellow-500"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20 focus-visible:ring-offset-2",
        },
        danger: {
          solid: `border-red-300 transition-all duration-200 ${
            isChecked ? "bg-red-600 border-red-600" : "hover:border-red-400"
          }`,
          bordered: `border-red-300 transition-all duration-200 ${
            isChecked ? "border-red-600 bg-red-50" : "hover:border-red-400"
          }`,
          light: `border-red-300 bg-red-50 transition-all duration-200 ${
            isChecked ? "bg-red-100 border-red-400" : "hover:bg-red-100"
          }`,
          dot: isChecked
            ? finalVariant === "solid"
              ? "bg-white"
              : "bg-red-600"
            : "bg-transparent",
          focus: "focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:ring-offset-2",
        },
      };

      return colorMap[baseColor];
    };

    const sizeClasses = getSizeClasses();
    const colorClasses = getColorClasses();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (groupContext?.onChange) {
        groupContext.onChange(e.target.value);
      } else if (onChange) {
        onChange(e);
      }
    };

    const handleClick = () => {
      if (!finalDisabled) {
        if (groupContext?.onChange) {
          groupContext.onChange(value);
        }
      }
    };

    return (
      <div className={`flex items-start ${className}`}>
        <div className="relative flex items-center">
          {/* Hidden native radio */}
          <input
            ref={ref}
            type="radio"
            name={groupContext?.name}
            value={value}
            checked={isChecked}
            disabled={finalDisabled}
            onChange={handleChange}
            className="sr-only peer"
            {...props}
          />

          {/* Custom radio */}
          <div
            className={`
            ${sizeClasses.radio}
            ${colorClasses[finalVariant]}
            ${colorClasses.focus}
            ${finalDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            border-2 rounded-full
            ${isChecked ? "scale-105" : "scale-100"}
            hover:scale-105 active:scale-95
            flex items-center justify-center
            relative overflow-hidden
            transition-transform duration-150 ease-in-out
          `}
            onClick={handleClick}
            role="radio"
            aria-checked={isChecked}
            aria-disabled={finalDisabled}
            tabIndex={finalDisabled ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !finalDisabled) {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            {/* Inner dot */}
            <div
              className={`
              ${sizeClasses.dot}
              ${colorClasses.dot}
              rounded-full
              transition-all duration-200 ease-in-out
              ${isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
            `}
            />

            {/* Ripple effect */}
            {isChecked && (
              <div
                className={`
                absolute inset-0 rounded-full
                animate-ping opacity-75
                ${finalVariant === "solid" ? "bg-white/50" : "bg-current/30"}
              `}
                style={{
                  animationDuration: "0.6s",
                  animationIterationCount: "1",
                }}
              />
            )}
          </div>
        </div>

        {/* Label */}
        {children && (
          <div className={sizeClasses.spacing}>
            <label
              className={`
              ${sizeClasses.text} font-medium cursor-pointer
              ${finalDisabled ? "opacity-50 cursor-not-allowed" : ""}
              ${finalInvalid ? "text-red-600" : "text-gray-700"}
              transition-colors duration-200
              block select-none
            `}
              onClick={handleClick}
            >
              {children}
            </label>
            {description && (
              <p
                className={`text-xs text-gray-500 mt-0.5 ${
                  finalDisabled ? "opacity-50" : ""
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
