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
        solid: "bg-slate-500",
        bordered: "bg-slate-500",
        light: "bg-slate-100 text-slate-700",
        flat: "bg-slate-200/80",
      },
      primary: {
        solid: "bg-primary/100",
        bordered: "bg-primary/100",
        light: "bg-primary/10 text-primary/100",
        flat: "bg-primary/80",
      },
      secondary: {
        solid: "bg-violet-500",
        bordered: "bg-violet-500",
        light: "bg-violet-100 text-violet-700",
        flat: "bg-violet-200/80",
      },
      success: {
        solid: "bg-green-500",
        bordered: "bg-green-500",
        light: "bg-green-100 text-green-700",
        flat: "bg-green-200/80",
      },
      warning: {
        solid: "bg-yellow-500",
        bordered: "bg-yellow-500",
        light: "bg-yellow-100 text-yellow-700",
        flat: "bg-yellow-200/80",
      },
      danger: {
        solid: "bg-red-500",
        bordered: "bg-red-500",
        light: "bg-red-100 text-red-700",
        flat: "bg-red-200/80",
      },
    };

    return colorMap[color][variant];
  };

  const getTrackClasses = () => {
    const trackMap = {
      solid: "bg-gray-200",
      bordered: "bg-white border-2 border-gray-300", // Add border to track
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
              className={getColorClasses().replace("bg-", "text-")}
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
        overflow-hidden shadow-sm relative
      `}
      >
        <div
          className={`
            ${getColorClasses()}
            ${
              isVertical
                ? `w-full ${getRadiusClasses()}`
                : `${heightClasses} ${getRadiusClasses()}`
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
          {!isIndeterminate && !disableAnimation && variant === "solid" && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
