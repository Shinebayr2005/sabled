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

      const colorVariants = {
        default: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-600 bg-gray-600",
            hover: "hover:border-gray-400 hover:bg-gray-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-600 bg-gray-50",
            hover: "hover:border-gray-400 hover:bg-gray-50",
            dot: "bg-gray-600",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          light: {
            base: "border-2 border-gray-200 bg-gray-50",
            checked: "border-gray-400 bg-gray-100",
            hover: "hover:border-gray-300 hover:bg-gray-100",
            dot: "bg-gray-600",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-gray-400 bg-gray-100",
            hover: "hover:border-gray-200 hover:bg-gray-50",
            dot: "bg-gray-600",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          flat: {
            base: "border-0 bg-gray-100",
            checked: "bg-gray-200",
            hover: "hover:bg-gray-150",
            dot: "bg-gray-600",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
        },
        primary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-primary",
            hover: "hover:border-primary/80 hover:bg-primary/5",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-primary/5",
            hover: "hover:border-primary/80 hover:bg-primary/25",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          light: {
            base: "border-2 border-primary/200 bg-primary/50",
            checked: "border-primary/400 bg-primary/100",
            hover: "hover:border-primary/300 hover:bg-primary/75",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-primary/400 bg-primary/100",
            hover: "hover:border-primary/200 hover:bg-primary/50",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          flat: {
            base: "border-0 bg-primary/100",
            checked: "bg-primary/200",
            hover: "hover:bg-primary/150",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
        },
        secondary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-secondary bg-secondary",
            hover: "hover:border-secondary/80 hover:bg-secondary/5",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-secondary bg-secondary/5",
            hover: "hover:border-secondary/80 hover:bg-secondary/25",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          light: {
            base: "border-2 border-secondary/200 bg-secondary/50",
            checked: "border-secondary/400 bg-secondary/100",
            hover: "hover:border-secondary/300 hover:bg-secondary/75",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-secondary/400 bg-secondary/100",
            hover: "hover:border-secondary/200 hover:bg-secondary/50",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          flat: {
            base: "border-0 bg-secondary/100",
            checked: "bg-secondary/200",
            hover: "hover:bg-secondary/150",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
        },
        success: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-green-600 bg-green-600",
            hover: "hover:border-green-400 hover:bg-green-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-green-600 bg-green-50",
            hover: "hover:border-green-400 hover:bg-green-25",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          light: {
            base: "border-2 border-green-200 bg-green-50",
            checked: "border-green-400 bg-green-100",
            hover: "hover:border-green-300 hover:bg-green-75",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-green-400 bg-green-100",
            hover: "hover:border-green-200 hover:bg-green-50",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          flat: {
            base: "border-0 bg-green-100",
            checked: "bg-green-200",
            hover: "hover:bg-green-150",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
        },
        warning: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-amber-500 bg-amber-500",
            hover: "hover:border-amber-400 hover:bg-amber-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-amber-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-amber-500 bg-amber-50",
            hover: "hover:border-amber-400 hover:bg-amber-25",
            dot: "bg-amber-600",
            focus: "focus-visible:ring-2 focus-visible:ring-amber-500/20",
          },
          light: {
            base: "border-2 border-amber-200 bg-amber-50",
            checked: "border-amber-400 bg-amber-100",
            hover: "hover:border-amber-300 hover:bg-amber-75",
            dot: "bg-amber-600",
            focus: "focus-visible:ring-2 focus-visible:ring-amber-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-amber-400 bg-amber-100",
            hover: "hover:border-amber-200 hover:bg-amber-50",
            dot: "bg-amber-600",
            focus: "focus-visible:ring-2 focus-visible:ring-amber-500/20",
          },
          flat: {
            base: "border-0 bg-amber-100",
            checked: "bg-amber-200",
            hover: "hover:bg-amber-150",
            dot: "bg-amber-600",
            focus: "focus-visible:ring-2 focus-visible:ring-amber-500/20",
          },
        },
        danger: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-600 bg-red-600",
            hover: "hover:border-red-400 hover:bg-red-50",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-600 bg-red-50",
            hover: "hover:border-red-400 hover:bg-red-25",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          light: {
            base: "border-2 border-red-200 bg-red-50",
            checked: "border-red-400 bg-red-100",
            hover: "hover:border-red-300 hover:bg-red-75",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "border-red-400 bg-red-100",
            hover: "hover:border-red-200 hover:bg-red-50",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          flat: {
            base: "border-0 bg-red-100",
            checked: "bg-red-200",
            hover: "hover:bg-red-150",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
        },
      };

      return colorVariants[baseColor][finalVariant];
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
