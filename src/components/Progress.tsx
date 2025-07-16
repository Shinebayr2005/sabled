import React from "react";

type ProgressVariant = "solid" | "bordered" | "light" | "flat";
type ProgressSize = "sm" | "md" | "lg";
type ProgressColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type ProgressRadius = "none" | "sm" | "md" | "lg" | "full";

interface BaseProgressProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  radius?: ProgressRadius;
  variant?: ProgressVariant;
  className?: string;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  label?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  valueLabel?: string;
}

interface LinearProgressProps extends BaseProgressProps {
  orientation?: "horizontal" | "vertical";
  isStriped?: boolean;
  disableAnimation?: boolean;
}

interface CircularProgressProps extends BaseProgressProps {
  strokeWidth?: number;
  trackStroke?: string;
}

type ProgressProps =
  | (LinearProgressProps & { type?: "linear" })
  | (CircularProgressProps & { type: "circular" });

const Progress: React.FC<ProgressProps> = (props) => {
  const {
    value = 0,
    minValue = 0,
    maxValue = 100,
    color = "primary",
    size = "md",
    radius = "full",
    variant = "solid",
    className = "",
    isIndeterminate = false,
    isDisabled = false,
    label,
    showValueLabel = false,
    valueLabel,
    type = "linear",
  } = props;

  const clampedValue = Math.min(maxValue, Math.max(minValue, value));
  const percentage = ((clampedValue - minValue) / (maxValue - minValue)) * 100;

  const getColorClasses = () => {
    const colorMap = {
      default: {
        solid: "bg-gray-900",
        bordered: "bg-gray-900",
        light: "bg-gray-100 text-gray-700",
        flat: "bg-gray-400",
      },
      primary: {
        solid: "bg-primary",
        bordered: "bg-primary",
        light: "bg-primary/10 text-primary",
        flat: "bg-primary",
      },
      secondary: {
        solid: "bg-secondary",
        bordered: "bg-secondary",
        light: "bg-secondary/10 text-secondary",
        flat: "bg-secondary",
      },
      success: {
        solid: "bg-green-600",
        bordered: "bg-green-600",
        light: "bg-green-100 text-green-700",
        flat: "bg-green-600",
      },
      warning: {
        solid: "bg-yellow-500",
        bordered: "bg-yellow-500",
        light: "bg-yellow-100 text-yellow-700",
        flat: "bg-yellow-500",
      },
      danger: {
        solid: "bg-red-600",
        bordered: "bg-red-600",
        light: "bg-red-100 text-red-700",
        flat: "bg-red-600",
      },
    };

    return colorMap[color][variant];
  };

  const getCircularColorClasses = () => {
    const colorMap = {
      default: {
        solid: "text-gray-900",
        bordered: "text-gray-900",
        light: "text-gray-700",
        flat: "text-gray-500",
      },
      primary: {
        solid: "text-primary",
        bordered: "text-primary",
        light: "text-primary",
        flat: "text-primary",
      },
      secondary: {
        solid: "text-secondary",
        bordered: "text-secondary",
        light: "text-secondary",
        flat: "text-secondary",
      },
      success: {
        solid: "text-green-600",
        bordered: "text-green-600",
        light: "text-green-700",
        flat: "text-green-500",
      },
      warning: {
        solid: "text-yellow-500",
        bordered: "text-yellow-500",
        light: "text-yellow-700",
        flat: "text-yellow-500",
      },
      danger: {
        solid: "text-red-600",
        bordered: "text-red-600",
        light: "text-red-700",
        flat: "text-red-500",
      },
    };

    return colorMap[color][variant];
  };

  const getTrackClasses = () => {
    const getBorderColor = () => {
      switch (color) {
        case "primary":
          return "border-primary";
        case "secondary":
          return "border-secondary";
        case "success":
          return "border-green-600";
        case "warning":
          return "border-yellow-500";
        case "danger":
          return "border-red-600";
        default:
          return "border-gray-900";
      }
    };

    const trackMap = {
      solid: "bg-gray-200",
      bordered: `bg-gray-50 border-2 ${getBorderColor()}`,
      light: "bg-gray-50",
      flat: "bg-gray-100",
    };
    return trackMap[variant];
  };

  const getRadiusClasses = () => {
    const radiusMap = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };
    return radiusMap[radius];
  };

  const getSizeClasses = () => {
    if (type === "circular") {
      const sizeMap = {
        sm: 32,
        md: 48,
        lg: 64,
      };
      return sizeMap[size];
    } else {
      const sizeMap = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      };
      return sizeMap[size];
    }
  };

  if (type === "circular") {
    const { strokeWidth = 4, trackStroke } = props as CircularProgressProps;
    const sizePx = getSizeClasses() as number;
    const radius = (sizePx - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        className={`inline-flex items-center justify-center ${className} ${
          isDisabled ? "opacity-50" : ""
        }`}
      >
        <div className="relative">
          <svg width={sizePx} height={sizePx} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke={trackStroke || "currentColor"}
              strokeWidth={strokeWidth}
              fill="none"
              className={
                variant === "bordered" ? "text-gray-300" : "text-gray-200"
              }
              opacity={variant === "light" ? "0.3" : "1"}
            />

            {/* Progress circle */}
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              className={getCircularColorClasses()}
              style={{
                strokeDasharray: isIndeterminate
                  ? `${circumference * 0.25} ${circumference * 0.75}`
                  : circumference,
                strokeDashoffset: isIndeterminate ? 0 : strokeDashoffset,
                transition: isIndeterminate
                  ? "none"
                  : "stroke-dashoffset 0.5s ease-in-out",
                animation: isIndeterminate
                  ? "circularProgress 1.4s ease-in-out infinite"
                  : undefined,
                transformOrigin: "center",
              }}
            />
          </svg>

          {/* Center content */}
          {(label || showValueLabel || valueLabel) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {(showValueLabel || valueLabel) && (
                  <span className="text-xs font-medium text-gray-700">
                    {valueLabel || `${Math.round(percentage)}%`}
                  </span>
                )}
                {label && (
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Linear Progress
  const {
    orientation = "horizontal",
    isStriped = false,
    disableAnimation = false,
  } = props as LinearProgressProps;
  const heightClasses = getSizeClasses() as string;
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`${isVertical ? "h-full w-fit" : "w-full"} ${className} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      {label && (
        <div
          className={`flex ${
            isVertical
              ? "flex-col items-center"
              : "justify-between items-center"
          } mb-2`}
        >
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {(showValueLabel || valueLabel) && (
            <span className="text-sm text-gray-500">
              {valueLabel || `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}

      <div
        className={`
        ${
          isVertical
            ? `w-2 h-full ${getRadiusClasses()}`
            : `w-full ${heightClasses} ${getRadiusClasses()}`
        }
        ${getTrackClasses()}
        overflow-hidden relative
        ${variant === "flat" ? "bg-opacity-20" : ""}
      `}
      >
        <div
          className={`
            ${getColorClasses()}
            ${
              isVertical
                ? `w-full ${variant !== "bordered" && getRadiusClasses()}`
                : `${heightClasses} ${variant !== "bordered" && getRadiusClasses()}`
            }
            ${!disableAnimation ? "transition-all duration-500 ease-out" : ""}
            ${isIndeterminate ? "animate-pulse" : ""}
            ${
              isStriped
                ? "bg-gradient-to-r from-current to-transparent bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]"
                : ""
            }
            relative overflow-hidden
            ${variant === "solid" ? "shadow-sm" : ""}
            ${variant === "flat" ? "opacity-70" : ""}
          `}
          style={{
            [isVertical ? "height" : "width"]: isIndeterminate
              ? "100%"
              : `${percentage}%`,
            animation: isIndeterminate
              ? "progressIndeterminate 2s ease-in-out infinite"
              : isStriped
              ? "stripes 1s linear infinite"
              : undefined,
          }}
        >
          {!isIndeterminate && !disableAnimation && (
            <div
              className={`absolute inset-0 ${
                variant === "solid"
                  ? "bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-60"
                  : variant === "bordered"
                  ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  : variant === "flat"
                  ? "bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  : ""
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
