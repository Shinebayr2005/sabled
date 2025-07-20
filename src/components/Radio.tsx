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
      const sizeVariants = {
        sm: {
          radio: "w-4 h-4",
          dot: "w-1.5 h-1.5",
          text: "text-sm",
          spacing: "ml-2",
          container: "gap-2",
        },
        md: {
          radio: "w-5 h-5",
          dot: "w-2 h-2",
          text: "text-sm",
          spacing: "ml-3",
          container: "gap-3",
        },
        lg: {
          radio: "w-6 h-6",
          dot: "w-2.5 h-2.5",
          text: "text-base",
          spacing: "ml-3",
          container: "gap-3",
        },
      };

      return sizeVariants[finalSize];
    };

    // Update the getColorClasses function with improved variant styling:
    const getColorClasses = () => {
      const baseColor = finalInvalid ? "danger" : finalColor;

      const colorVariants = {
        default: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-900 bg-gray-900",
            hover: "hover:border-gray-400 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-700 bg-white ring-2 ring-gray-200",
            hover: "hover:border-gray-400 hover:ring-1 hover:ring-gray-200",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          light: {
            base: "border-2 border-gray-200 bg-gray-50",
            checked: "border-gray-300 bg-gray-100 shadow-inner",
            hover: "hover:border-gray-250 hover:bg-gray-75",
            dot: "bg-gray-800",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
          ghost: {
            base: "border-2 border-gray-200 bg-gray-50/50",
            checked: "border-gray-300 bg-gray-100 shadow-sm border-none",
            hover: "hover:border-gray-250 hover:bg-gray-75",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-0",
          },
          flat: {
            base: "border-0 bg-gray-100 shadow-inner",
            checked: "bg-gray-200 shadow-md",
            hover: "hover:bg-gray-150 hover:shadow-sm",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-gray-500/20",
          },
        },
        primary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-primary shadow-lg shadow-primary/25",
            hover: "hover:border-primary/70 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-white ring-2 ring-primary/30",
            hover: "hover:border-primary/80 hover:ring-1 hover:ring-primary/20",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          light: {
            base: "border-2 border-primary/30 bg-primary/5",
            checked:
              "border-primary/50 bg-primary/15 shadow-inner shadow-primary/20",
            hover: "hover:border-primary/40 hover:bg-primary/10",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
          ghost: {
            base: "border-2 border-primary/20 bg-primary/5",
            checked:
              "border-primary/30 bg-primary/10 shadow-sm shadow-primary/10 border-none",
            hover: "hover:border-primary/25 hover:bg-primary/7",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:!ring-primary/20",
          },
          flat: {
            base: "border-0 bg-primary/10 shadow-inner",
            checked: "bg-primary/30 shadow-md shadow-primary",
            hover: "hover:bg-primary/15 hover:shadow-sm",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-primary/20",
          },
        },
        secondary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked:
              "border-secondary bg-secondary shadow-lg shadow-secondary/25",
            hover: "hover:border-secondary/70 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-secondary bg-white ring-2 ring-secondary/30",
            hover:
              "hover:border-secondary/80 hover:ring-1 hover:ring-secondary/20",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          light: {
            base: "border-2 border-secondary/30 bg-secondary/5",
            checked:
              "border-secondary/50 bg-secondary/15 shadow-inner shadow-secondary/20",
            hover: "hover:border-secondary/40 hover:bg-secondary/10",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          ghost: {
            base: "border-2 border-secondary/20 bg-secondary/5",
            checked:
              "border-secondary/30 bg-secondary/10 shadow-sm shadow-secondary/10",
            hover: "hover:border-secondary/25 hover:bg-secondary/7",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
          flat: {
            base: "border-0 bg-secondary/10 shadow-inner",
            checked: "bg-secondary/20 shadow-md shadow-secondary/20",
            hover: "hover:bg-secondary/15 hover:shadow-sm",
            dot: "bg-secondary",
            focus: "focus-visible:ring-2 focus-visible:ring-secondary/20",
          },
        },
        success: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked:
              "border-green-600 bg-green-600 shadow-lg shadow-green-500/25",
            hover: "hover:border-green-500 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-green-600 bg-white ring-2 ring-green-200",
            hover: "hover:border-green-500 hover:ring-1 hover:ring-green-100",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          light: {
            base: "border-2 border-green-200 bg-green-50",
            checked:
              "border-green-300 bg-green-100 shadow-inner shadow-green-200/50",
            hover: "hover:border-green-250 hover:bg-green-75",
            dot: "bg-green-700",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          ghost: {
            base: "border-2 border-green-200 bg-green-50/50",
            checked:
              "border-green-300 bg-green-100 shadow-sm shadow-green-200/30",
            hover: "hover:border-green-250 hover:bg-green-75",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          flat: {
            base: "border-0 bg-green-100 shadow-inner",
            checked: "bg-green-200 shadow-md shadow-green-300/30",
            hover: "hover:bg-green-150 hover:shadow-sm",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
        },
        warning: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked:
              "border-yellow-500 bg-yellow-500 shadow-lg shadow-yellow-400/25",
            hover: "hover:border-yellow-400 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-yellow-500 bg-white ring-2 ring-yellow-200",
            hover: "hover:border-yellow-400 hover:ring-1 hover:ring-yellow-100",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          light: {
            base: "border-2 border-yellow-200 bg-yellow-50",
            checked:
              "border-yellow-300 bg-yellow-100 shadow-inner shadow-yellow-200/50",
            hover: "hover:border-yellow-250 hover:bg-yellow-75",
            dot: "bg-yellow-800",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          ghost: {
            base: "border-2 border-yellow-200 bg-yellow-50/50",
            checked:
              "border-yellow-300 bg-yellow-100 shadow-sm shadow-yellow-200/30",
            hover: "hover:border-yellow-250 hover:bg-yellow-75",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          flat: {
            base: "border-0 bg-yellow-100 shadow-inner",
            checked: "bg-yellow-200 shadow-md shadow-yellow-300/30",
            hover: "hover:bg-yellow-150 hover:shadow-sm",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
        },
        danger: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-600 bg-red-600 shadow-lg shadow-red-500/25",
            hover: "hover:border-red-500 hover:shadow-sm",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          bordered: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-red-600 bg-white ring-2 ring-red-200",
            hover: "hover:border-red-500 hover:ring-1 hover:ring-red-100",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          light: {
            base: "border-2 border-red-200 bg-red-50",
            checked: "border-red-300 bg-red-100 shadow-inner shadow-red-200/50",
            hover: "hover:border-red-250 hover:bg-red-75",
            dot: "bg-red-700",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          ghost: {
            base: "border-2 border-red-200 bg-red-50/50",
            checked: "border-red-300 bg-red-100 shadow-sm shadow-red-200/30",
            hover: "hover:border-red-250 hover:bg-red-75",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          flat: {
            base: "border-0 bg-red-100 shadow-inner",
            checked: "bg-red-200 shadow-md shadow-red-300/30",
            hover: "hover:bg-red-150 hover:shadow-sm",
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
      <div className={`flex items-start ${sizeClasses.container} ${className}`}>
        <div className="relative flex items-center flex-shrink-0">
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

          {/* Custom radio circle */}
          <div
            className={`
              ${sizeClasses.radio}
              ${isChecked ? colorClasses.checked : colorClasses.base}
              ${!finalDisabled && !isChecked ? colorClasses.hover : ""}
              ${colorClasses.focus}
              ${
                finalDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
              rounded-full
              flex items-center justify-center
              relative overflow-hidden
              transition-all duration-200 ease-in-out
              transform-gpu
              ${isChecked ? "scale-105" : "scale-100"}
              ${!finalDisabled ? "hover:scale-105 active:scale-95" : ""}
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
            {/* Inner dot with smooth animation */}
            <div
              className={`
                ${sizeClasses.dot}
                ${colorClasses.dot}
                rounded-full
                transition-all duration-200 ease-in-out
                transform-gpu
                ${isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
              `}
            />
          </div>
        </div>

        {/* Label section */}
        {children && (
          <div className={`${sizeClasses.spacing} flex-1 min-w-0`}>
            <label
              className={`
                ${sizeClasses.text} 
                font-medium 
                cursor-pointer
                ${finalDisabled ? "opacity-50 cursor-not-allowed" : ""}
                ${finalInvalid ? "text-red-600" : "text-gray-900"}
                transition-colors duration-200
                block 
                select-none
                leading-tight
              `}
              onClick={handleClick}
            >
              {children}
            </label>
            {description && (
              <p
                className={`
                  text-xs 
                  ${finalInvalid ? "text-red-500" : "text-gray-500"} 
                  mt-1 
                  leading-relaxed
                  ${finalDisabled ? "opacity-50" : ""}
                `}
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
