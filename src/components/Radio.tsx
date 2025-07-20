import React, { forwardRef } from "react";
import { useRadioGroup } from "./RadioGroup";

export type RadioSize = "sm" | "md" | "lg";
export type RadioColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type RadioVariant =
  | "solid"
  | "bordered"
  | "light"
  | "ghost"
  | "flat"
  | "soft"
  | "outline-filled";

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

      // Helper functions for consistent styling
      const getRing = (color: string) =>
        `focus-visible:ring-2 focus-visible:ring-${color}-500/20`;
      const getHoverBorder = (color: string, opacity = "60") =>
        `hover:border-${color}-500/${opacity}`;
      const getShadow = (color: string) => `shadow-lg shadow-${color}-500/25`;

      const colorVariants = {
        default: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-gray-900 bg-gray-900 shadow-md shadow-gray-500/40 scale-[1.02]",
            hover: "hover:border-gray-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500",
          },
          bordered: {
            base: "border-2 border-gray-300/60 bg-white",
            checked: "border-gray-600 bg-gray-500/5 ring-2 ring-gray-500/30 shadow-sm",
            hover: "hover:bg-gray-500/10 hover:border-gray-500 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500",
          },
          light: {
            base: "border border-gray-200/30 bg-gray-500/5",
            checked: "bg-gray-500/10 border-gray-400/40 ring-1 ring-gray-300/40",
            hover: "hover:bg-gray-500/10 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "bg-gray-500/5 border-0",
            hover: "hover:bg-gray-500/5 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400",
          },
          flat: {
            base: "border-0 bg-gray-500/10",
            checked: "bg-gray-500/30 shadow-inner",
            hover: "hover:bg-gray-500/20 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-gray-700",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400",
          },
          soft: {
            base: "border border-gray-200/60 bg-gray-100/40 backdrop-blur-sm",
            checked:
              "bg-gray-500/10 border-gray-500 ring-2 ring-gray-400/30 glow-gray",
            hover: "hover:bg-gray-500/5 hover:border-gray-400/40",
            dot: "bg-gray-600",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-gray-400 bg-transparent",
            checked:
              "bg-gray-600 text-white ring-2 ring-offset-2 ring-gray-400/40 border-gray-600",
            hover: "hover:bg-gray-100/10 hover:border-gray-500",
            dot: "bg-white",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500/30",
          },
        },
        primary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-primary bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/40 scale-[1.02]",
            hover: "hover:border-primary-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          },
          bordered: {
            base: "border-2 border-primary/60 bg-white",
            checked: "border-primary bg-primary/10 ring-2 ring-primary shadow-sm",
            hover: "hover:bg-primary/10 hover:border-primary active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          },
          light: {
            base: "border border-primary/20 bg-primary/5",
            checked: "bg-primary/10 border-primary/30 ring-1 ring-primary/40",
            hover: "hover:bg-primary/10 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "bg-primary/5 border-0",
            hover: "hover:bg-primary/5 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          },
          flat: {
            base: "border-0 bg-primary/10",
            checked: "bg-primary/30 shadow-inner",
            hover: "hover:bg-primary/20 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          },
          soft: {
            base: "border border-primary/20 bg-primary/5 backdrop-blur-sm",
            checked: "bg-primary/10 border-primary ring-2 ring-primary/30 shadow-primary/20 shadow-lg",
            hover: "hover:bg-primary/8 hover:border-primary/40 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-primary",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-primary bg-transparent",
            checked: "bg-primary text-white ring-2 ring-offset-2 ring-primary/40 border-primary",
            hover: "hover:bg-primary/10 hover:border-primary active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/30",
          },
        },
        secondary: {
          solid: {
            base: "border-2 border-gray-300 bg-white",
            checked: "border-cyan-600 bg-gradient-to-r from-cyan-500 to-cyan-700 shadow-md shadow-cyan-500/40 scale-[1.02]",
            hover: "hover:border-cyan-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          },
          bordered: {
            base: "border-2 border-cyan-500/60 bg-white",
            checked: "border-cyan-600 bg-cyan-500/10 ring-2 ring-cyan-500 shadow-sm",
            hover: "hover:bg-cyan-500/10 hover:border-cyan-600 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-cyan-600",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          },
          light: {
            base: "border border-cyan-200/30 bg-cyan-500/5",
            checked: "bg-cyan-500/10 border-cyan-400/40 ring-1 ring-cyan-300/40",
            hover: "hover:bg-cyan-500/10 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-cyan-600",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          },
          ghost: {
            base: "border-2 border-transparent bg-transparent",
            checked: "bg-cyan-500/5 border-0",
            hover: "hover:bg-cyan-500/5 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-cyan-600",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          },
          flat: {
            base: "border-0 bg-cyan-500/10",
            checked: "bg-cyan-500/30 shadow-inner",
            hover: "hover:bg-cyan-500/20 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-cyan-600",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500",
          },
          soft: {
            base: "border border-cyan-200/60 bg-cyan-50/40 backdrop-blur-sm",
            checked: "bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-400/30 shadow-cyan-500/20 shadow-lg",
            hover: "hover:bg-cyan-500/5 hover:border-cyan-300/40 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-cyan-600",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-cyan-500 bg-transparent",
            checked: "bg-cyan-600 text-white ring-2 ring-offset-2 ring-cyan-400/40 border-cyan-600",
            hover: "hover:bg-cyan-100/10 hover:border-cyan-600 active:scale-[0.98] transition-all duration-200 ease-in-out",
            dot: "bg-white",
            focus: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500/30",
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
            base: "border-2 border-green-200/60 bg-white shadow-sm",
            checked:
              "border-green-600 bg-white ring-4 ring-green-200/60 shadow-md shadow-green-400/20",
            hover:
              "hover:border-green-400 hover:ring-2 hover:ring-green-200/40 hover:shadow-sm",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          light: {
            base: "border-2 border-green-200/60 bg-green-50/50",
            checked:
              "border-green-600 bg-green-150 shadow-inner ring-2 ring-green-400/50 backdrop-blur-sm",
            hover: "hover:border-green-300 hover:bg-green-75",
            dot: "bg-green-700",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-green-50/40 hover:bg-green-100/60",
            checked: "border-0 bg-green-100 shadow-sm ring-2 ring-green-300/40",
            hover: "hover:bg-green-75",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          flat: {
            base: "border-0 bg-green-100 shadow-inner",
            checked:
              "bg-green-300/90 shadow-lg ring-3 ring-green-500/40 border border-green-500/50",
            hover: "hover:bg-green-150 hover:shadow-sm",
            dot: "bg-green-600",
            focus: "focus-visible:ring-2 focus-visible:ring-green-500/20",
          },
          soft: {
            base: "border border-green-200/60 bg-green-50/40 backdrop-blur-sm",
            checked:
              "bg-green-500/10 border-green-500 ring-2 ring-green-400/30 shadow-green-500/20 shadow-lg",
            hover: "hover:bg-green-500/5 hover:border-green-300/40",
            dot: "bg-green-600",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-green-500 bg-transparent",
            checked:
              "bg-green-600 text-white ring-2 ring-offset-2 ring-green-400/40 border-green-600",
            hover: "hover:bg-green-100/10 hover:border-green-600",
            dot: "bg-white",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500/30",
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
            base: "border-2 border-yellow-200/60 bg-white shadow-sm",
            checked:
              "border-yellow-500 bg-white ring-4 ring-yellow-200/60 shadow-md shadow-yellow-400/20",
            hover:
              "hover:border-yellow-400 hover:ring-2 hover:ring-yellow-200/40 hover:shadow-sm",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          light: {
            base: "border-2 border-yellow-200/60 bg-yellow-50/50",
            checked:
              "border-yellow-600 bg-yellow-150 shadow-inner ring-2 ring-yellow-400/50 backdrop-blur-sm",
            hover: "hover:border-yellow-300 hover:bg-yellow-75",
            dot: "bg-yellow-700",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-yellow-50/40 hover:bg-yellow-100/60",
            checked:
              "border-0 bg-yellow-100 shadow-sm ring-2 ring-yellow-300/40",
            hover: "hover:bg-yellow-75",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          flat: {
            base: "border-0 bg-yellow-100 shadow-inner",
            checked:
              "bg-yellow-300/90 shadow-lg ring-3 ring-yellow-500/40 border border-yellow-500/50",
            hover: "hover:bg-yellow-150 hover:shadow-sm",
            dot: "bg-yellow-600",
            focus: "focus-visible:ring-2 focus-visible:ring-yellow-500/20",
          },
          soft: {
            base: "border border-yellow-200/60 bg-yellow-50/40 backdrop-blur-sm",
            checked:
              "bg-yellow-500/10 border-yellow-500 ring-2 ring-yellow-400/30 shadow-yellow-500/20 shadow-lg",
            hover: "hover:bg-yellow-500/5 hover:border-yellow-300/40",
            dot: "bg-yellow-600",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-yellow-500 bg-transparent",
            checked:
              "bg-yellow-500 text-white ring-2 ring-offset-2 ring-yellow-400/40 border-yellow-500",
            hover: "hover:bg-yellow-100/10 hover:border-yellow-600",
            dot: "bg-white",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500/30",
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
            base: "border-2 border-red-200/60 bg-white shadow-sm",
            checked:
              "border-red-600 bg-white ring-4 ring-red-200/60 shadow-md shadow-red-400/20",
            hover:
              "hover:border-red-400 hover:ring-2 hover:ring-red-200/40 hover:shadow-sm",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          light: {
            base: "border-2 border-red-200/60 bg-red-50/50",
            checked:
              "border-red-600 bg-red-150 shadow-inner ring-2 ring-red-400/50 backdrop-blur-sm",
            hover: "hover:border-red-300 hover:bg-red-75",
            dot: "bg-red-700",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          ghost: {
            base: "border-2 border-transparent bg-red-50/40 hover:bg-red-100/60",
            checked: "border-0 bg-red-100 shadow-sm ring-2 ring-red-300/40",
            hover: "hover:bg-red-75",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          flat: {
            base: "border-0 bg-red-100 shadow-inner",
            checked:
              "bg-red-300/90 shadow-lg ring-3 ring-red-500/40 border border-red-500/50",
            hover: "hover:bg-red-150 hover:shadow-sm",
            dot: "bg-red-600",
            focus: "focus-visible:ring-2 focus-visible:ring-red-500/20",
          },
          soft: {
            base: "border border-red-200/60 bg-red-50/40 backdrop-blur-sm",
            checked:
              "bg-red-500/10 border-red-500 ring-2 ring-red-400/30 shadow-red-500/20 shadow-lg",
            hover: "hover:bg-red-500/5 hover:border-red-300/40",
            dot: "bg-red-600",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500/30",
          },
          "outline-filled": {
            base: "border-[1.5px] border-red-500 bg-transparent",
            checked:
              "bg-red-600 text-white ring-2 ring-offset-2 ring-red-400/40 border-red-600",
            hover: "hover:bg-red-100/10 hover:border-red-600",
            dot: "bg-white",
            focus:
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500/30",
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
              transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
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
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
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
                transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
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
