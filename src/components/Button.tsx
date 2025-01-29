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

    setRipples(prev => {
      return [...prev, { x, y, size, color: rippleColor }];
    });

    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 500);
  };

  const colorClasses = {
    default: {
      solid: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      outlined: "border border-gray-300 text-gray-800 hover:bg-gray-100",
      dashed:
        "border border-dashed border-gray-300 text-gray-800 hover:bg-gray-100",
      text: "text-gray-800 hover:bg-gray-100",
      link: "text-blue-500 hover:underline",
    },
    primary: {
      solid: "bg-primary text-white hover:bg-primary/80",
      outlined: "border border-primary text-primary hover:bg-primary/10",
      dashed:
        "border border-dashed border-primary text-primary hover:bg-primary/10",
      text: "text-primary hover:bg-primary/10",
      link: "text-primary hover:underline",
    },
    danger: {
      solid: "bg-red-500 text-white hover:bg-red-600",
      outlined: "border border-red-500 text-red-500 hover:bg-red-50",
      dashed:
        "border border-dashed border-red-500 text-red-500 hover:bg-red-50",
      text: "text-red-500 hover:bg-red-50",
      link: "text-red-500 hover:underline",
    },
    success: {
      solid: "bg-green-500 text-white hover:bg-green-600",
      outlined: "border border-green-500 text-green-500 hover:bg-green-50",
      dashed:
        "border border-dashed border-green-500 text-green-500 hover:bg-green-50",
      text: "text-green-500 hover:bg-green-50",
      link: "text-green-500 hover:underline",
    },
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
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
          ${sizeClasses[size]} 
          ${colorClasses[color][variant]} 
          ${borderRadiusClasses[borderRadius]}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
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
