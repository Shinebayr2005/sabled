import React, { useState, MouseEvent } from "react";

type ButtonVariant = "solid" | "outlined" | "dashed" | "text" | "link";
type ButtonColor = "default" | "primary" | "danger" | "success";
type ButtonSize = "small" | "medium" | "large";
type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  borderRadius?: BorderRadius;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  color = "default",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  iconLeft,
  iconRight,
  type = "button",
  style,
  borderRadius = "md",
}) => {
  const [ripples, setRipples] = useState<
    { x: number; y: number; size: number; color: string }[]
  >([]);

  const getRippleColor = () => {
    if (variant === "solid") {
      return color === "default"
        ? "rgba(160, 160, 160, 0.4)"
        : "rgba(255, 255, 255, 0.5)";
    }
    return (
      {
        primary: "rgba(59, 130, 246, 0.3)",
        danger: "rgba(239, 68, 68, 0.3)",
        success: "rgba(34, 197, 94, 0.3)",
        default: "rgba(0, 0, 0, 0.2)",
      }[color] || "rgba(0, 0, 0, 0.2)"
    );
  };

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const rippleColor = getRippleColor();

    setRipples((prev) => {
      return [...prev, { x, y, size, color: rippleColor }];
    });

    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 1000);
  };

  const colorClasses = {
    default: {
      solid:
        "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 shadow-sm hover:shadow-md",
      outlined:
        "border-2 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200",
      dashed:
        "border-2 border-dashed border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400",
      text: "text-gray-800 hover:bg-gray-100 active:bg-gray-200",
      link: "text-gray-600 hover:text-gray-800 hover:underline underline-offset-4",
    },
    primary: {
      solid:
        "bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-lg hover:shadow-xl",
      outlined:
        "border-2 border-primary text-primary hover:bg-primary-50 hover:border-primary-600 active:bg-primary-100",
      dashed:
        "border-2 border-dashed border-primary text-primary hover:bg-primary-50 hover:border-primary-600",
      text: "text-primary hover:bg-primary-50 active:bg-primary-100",
      link: "text-primary hover:text-primary-600 hover:underline underline-offset-4",
    },
    danger: {
      solid:
        "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl",
      outlined:
        "border-2 border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 active:bg-red-100",
      dashed:
        "border-2 border-dashed border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600",
      text: "text-red-500 hover:bg-red-50 active:bg-red-100",
      link: "text-red-500 hover:text-red-600 hover:underline underline-offset-4",
    },
    success: {
      solid:
        "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-lg hover:shadow-xl",
      outlined:
        "border-2 border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600 active:bg-green-100",
      dashed:
        "border-2 border-dashed border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600",
      text: "text-green-500 hover:bg-green-50 active:bg-green-100",
      link: "text-green-500 hover:text-green-600 hover:underline underline-offset-4",
    },
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm min-h-[32px]",
    medium: "px-4 py-2.5 text-base min-h-[40px]",
    large: "px-6 py-3.5 text-lg min-h-[48px]",
  };

  const borderRadiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <div className="relative inline-block overflow-hidden">
      <button
        type={type}
        disabled={disabled || loading}
        style={style}
        className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out overflow-hidden
          focus:outline-none active:scale-95 transform
          ${sizeClasses[size]} 
          ${colorClasses[color][variant]} 
          ${borderRadiusClasses[borderRadius]}
          ${disabled ? "opacity-50 cursor-not-allowed transform-none" : ""}
          ${loading ? "cursor-wait" : ""}
          ${className}
        `}
        onClick={(event) => {
          createRipple(event);
          if (onClick) onClick(event);
        }}
      >
        {loading && <span className="loader mr-2"></span>}
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="ml-2">{iconRight}</span>}

        {ripples.map((ripple, index) => (
          <span
            key={index}
            className="absolute rounded-full ripple"
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: ripple.color,
              pointerEvents: "none",
            }}
          />
        ))}
      </button>
    </div>
  );
};

export default Button;
