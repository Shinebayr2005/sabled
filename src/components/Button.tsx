import React, { useState, MouseEvent } from "react";

export type ButtonVariant =
  | "solid"
  | "flat"
  | "faded"
  | "shadow"
  | "bordered"
  | "ghost";
export type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  radius?: ButtonRadius;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  fullWidth?: boolean;
  disableAnimation?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  color = "default",
  size = "md",
  radius = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  startContent,
  endContent,
  type = "button",
  style,
  fullWidth = false,
  disableAnimation = false,
}) => {
  const [ripples, setRipples] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-h-8",
    md: "px-4 py-2 text-sm min-h-10",
    lg: "px-6 py-3 text-base min-h-12",
  };

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const colorClasses = {
    default: {
      solid: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700",
      flat: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
      faded:
        "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
      shadow:
        "bg-gray-900 text-white shadow-lg shadow-gray-900/25 hover:shadow-gray-900/40",
      bordered:
        "bg-transparent text-gray-700 border-2 border-gray-300 hover:border-gray-400",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    },
    primary: {
      solid: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
      flat: "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30",
      faded:
        "bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10",
      shadow:
        "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
      bordered:
        "bg-transparent text-primary border-2 border-primary hover:border-primary/80",
      ghost: "bg-transparent text-primary hover:bg-primary/10",
    },
    secondary: {
      solid:
        "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
      flat: "bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-300",
      faded:
        "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100",
      shadow:
        "bg-purple-600 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40",
      bordered:
        "bg-transparent text-purple-600 border-2 border-purple-300 hover:border-purple-400",
      ghost: "bg-transparent text-purple-600 hover:bg-purple-50",
    },
    success: {
      solid: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
      flat: "bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300",
      faded:
        "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100",
      shadow:
        "bg-green-600 text-white shadow-lg shadow-green-600/25 hover:shadow-green-600/40",
      bordered:
        "bg-transparent text-green-600 border-2 border-green-300 hover:border-green-400",
      ghost: "bg-transparent text-green-600 hover:bg-green-50",
    },
    warning: {
      solid:
        "bg-yellow-500 text-black hover:bg-yellow-600 active:bg-yellow-700",
      flat: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300",
      faded:
        "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100",
      shadow:
        "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40",
      bordered:
        "bg-transparent text-yellow-700 border-2 border-yellow-300 hover:border-yellow-400",
      ghost: "bg-transparent text-yellow-700 hover:bg-yellow-50",
    },
    danger: {
      solid: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      flat: "bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-300",
      faded: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
      shadow:
        "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40",
      bordered:
        "bg-transparent text-red-600 border-2 border-red-300 hover:border-red-400",
      ghost: "bg-transparent text-red-600 hover:bg-red-50",
    },
  };

  const getRippleColor = () => {
    if (variant === "solid") {
      return color === "default" || color === "warning"
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.4)";
    }
    return (
      {
        primary: "rgba(59, 130, 246, 0.3)",
        secondary: "rgba(147, 51, 234, 0.3)",
        danger: "rgba(239, 68, 68, 0.3)",
        success: "rgba(34, 197, 94, 0.3)",
        warning: "rgba(245, 158, 11, 0.3)",
        default: "rgba(107, 114, 128, 0.3)",
      }[color] || "rgba(107, 114, 128, 0.3)"
    );
  };

  const handleRippleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || disableAnimation) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const rippleColor = getRippleColor();

    const newRipple = { x, y, size, color: rippleColor };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    if (onClick) {
      onClick(event);
    }
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    overflow-hidden
    ${fullWidth ? "w-full" : ""}
    ${
      !disableAnimation
        ? "transform hover:scale-[1.02] active:scale-[0.98]"
        : ""
    }
  `
    .replace(/\s+/g, " ")
    .trim();

  const focusClasses = {
    default: "focus:ring-gray-500",
    primary: "focus:ring-primary",
    secondary: "focus:ring-purple-500",
    success: "focus:ring-green-500",
    warning: "focus:ring-yellow-500",
    danger: "focus:ring-red-500",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleRippleClick}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${colorClasses[color][variant]}
        ${radiusClasses[radius]}
        ${focusClasses[color]}
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      style={style}
    >
      {/* Ripple Effect */}
      {!disableAnimation &&
        ripples.map((ripple, index) => (
          <span
            key={index}
            className="absolute animate-ping rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: ripple.color,
              animationDuration: "600ms",
            }}
          />
        ))}

      {/* Loading Spinner */}
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Start Content */}
      {startContent && (
        <span className={`${children ? "mr-2" : ""} flex items-center`}>
          {startContent}
        </span>
      )}

      {/* Button Content */}
      {children}

      {/* End Content */}
      {endContent && (
        <span className={`${children ? "ml-2" : ""} flex items-center`}>
          {endContent}
        </span>
      )}
    </button>
  );
};

export default Button;
