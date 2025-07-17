import React, { forwardRef } from "react";
import { useRadioGroup } from "./RadioGroup";

type RadioSize = "sm" | "md" | "lg";
type RadioColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type RadioVariant = "solid" | "bordered" | "light" | "ghost" | "flat";

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
          dot: "w-1.5 h-1.5",
        },
        md: {
          radio: "w-5 h-5",
          text: "text-sm",
          spacing: "ml-3",
          dot: "w-2 h-2",
        },
        lg: {
          radio: "w-6 h-6",
          text: "text-base",
          spacing: "ml-3",
          dot: "w-2.5 h-2.5",
        },
      };
      return sizeMap[finalSize];
    };

    const getColorClasses = () => {
      const baseColor = finalInvalid ? "danger" : finalColor;
      
      // Color system matching your Button component exactly
      const colorVariants = {
        default: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-900 bg-gray-900",
            hover: "hover:border-gray-800 hover:bg-gray-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-700 bg-transparent",
            hover: "hover:border-gray-400 hover:bg-gray-50",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          light: {
            base: "border-2 border-gray-200 bg-gray-100",
            checked: "border-gray-400 bg-gray-200",
            hover: "hover:border-gray-300 hover:bg-gray-150",
            dot: "bg-gray-900",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-gray-100",
            hover: "hover:bg-gray-50",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          flat: {
            base: "border-0 bg-gray-50",
            checked: "bg-gray-100",
            hover: "hover:bg-gray-100",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
        },
        primary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "bg-primary text-white border-primary", // Same as Button
            hover: "hover:border-primary/90 hover:bg-primary/5",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-transparent text-primary", // Match Button bordered
            hover: "hover:border-primary/80 hover:bg-primary/5",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          light: {
            base: "border-2 border-primary/20 bg-primary/10",
            checked: "border-primary/30 bg-primary/20 text-primary", // Match Button flat
            hover: "hover:border-primary/25 hover:bg-primary/15",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-primary/10 text-primary", // Match Button ghost
            hover: "hover:bg-primary/5",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          flat: {
            base: "border-0 bg-primary/10", // Match Button flat base
            checked: "bg-primary/20 text-primary",
            hover: "hover:bg-primary/15",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
        },
        secondary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "bg-secondary text-white border-secondary", // Same as Button
            hover: "hover:border-secondary/90 hover:bg-secondary/5",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-secondary bg-transparent text-secondary",
            hover: "hover:border-secondary/80 hover:bg-secondary/5",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          light: {
            base: "border-2 border-secondary/20 bg-secondary/10",
            checked: "border-secondary/30 bg-secondary/20 text-secondary",
            hover: "hover:border-secondary/25 hover:bg-secondary/15",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-secondary/10 text-secondary",
            hover: "hover:bg-secondary/5",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          flat: {
            base: "border-0 bg-secondary/10",
            checked: "bg-secondary/20 text-secondary",
            hover: "hover:bg-secondary/15",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
        },
        success: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-green-600 bg-green-600",
            hover: "hover:border-green-700 hover:bg-green-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-green-300 bg-transparent",
            hover: "hover:border-green-400 hover:bg-green-50",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          light: {
            base: "border-2 border-green-200 bg-green-100",
            checked: "border-green-300 bg-green-200",
            hover: "hover:border-green-250 hover:bg-green-150",
            dot: "bg-green-700",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-green-50",
            hover: "hover:bg-green-50",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          flat: {
            base: "border-0 bg-green-50",
            checked: "bg-green-100",
            hover: "hover:bg-green-100",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
        },
        warning: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-yellow-500 bg-yellow-500",
            hover: "hover:border-yellow-600 hover:bg-yellow-50",
            dot: "bg-black",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-yellow-300 bg-transparent",
            hover: "hover:border-yellow-400 hover:bg-yellow-50",
            dot: "bg-yellow-700",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          light: {
            base: "border-2 border-yellow-200 bg-yellow-100",
            checked: "border-yellow-300 bg-yellow-200",
            hover: "hover:border-yellow-250 hover:bg-yellow-150",
            dot: "bg-yellow-800",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-yellow-50",
            hover: "hover:bg-yellow-50",
            dot: "bg-yellow-700",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          flat: {
            base: "border-0 bg-yellow-50",
            checked: "bg-yellow-100",
            hover: "hover:bg-yellow-100",
            dot: "bg-yellow-700",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
        },
        danger: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-600 bg-red-600",
            hover: "hover:border-red-700 hover:bg-red-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-300 bg-transparent",
            hover: "hover:border-red-400 hover:bg-red-50",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          light: {
            base: "border-2 border-red-200 bg-red-100",
            checked: "border-red-300 bg-red-200",
            hover: "hover:border-red-250 hover:bg-red-150",
            dot: "bg-red-700",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-transparent bg-red-50",
            hover: "hover:bg-red-50",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          flat: {
            base: "border-0 bg-red-50",
            checked: "bg-red-100",
            hover: "hover:bg-red-100",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
        },
      };

      return colorVariants[baseColor][finalVariant];
    };

    const sizeClasses = getSizeClasses();
    const colorClasses = getColorClasses();

    // Event handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!finalDisabled) {
        if (groupContext?.onChange) {
          groupContext.onChange(value);
        } else if (onChange) {
          onChange(e);
        }
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
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
            className="sr-only"
            {...props}
          />

          {/* Custom radio */}
          <div
            className={`
            ${sizeClasses.radio}
            ${colorClasses.base}
            ${isChecked ? colorClasses.checked : colorClasses.hover}
            ${colorClasses.focus}
            ${
              finalDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }
            rounded-full
            ${isChecked ? "scale-105" : "scale-100"}
            hover:scale-105 active:scale-95
            flex items-center justify-center
            relative overflow-hidden
            transition-all duration-200 ease-in-out
            shadow-sm
          `}
            onClick={handleClick}
            role="radio"
            aria-checked={isChecked}
            aria-disabled={finalDisabled}
            tabIndex={finalDisabled ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !finalDisabled) {
                e.preventDefault();
                handleClick(e as any);
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
                ${finalVariant === "solid" ? "bg-white/30" : "bg-current/30"}
              `}
                style={{
                  animationDuration: "0.6s",
                  animationIterationCount: "1",
                }}
              />
            )}

            {/* Selection ring for bordered variant */}
            {isChecked && finalVariant === "bordered" && (
              <div className="absolute inset-1 rounded-full border border-current opacity-50" />
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
              leading-tight
            `}
              onClick={handleClick}
            >
              {children}
            </label>
            {description && (
              <p
                className={`text-xs text-gray-500 mt-0.5 leading-snug ${
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
