import React from "react";

export type BadgeVariant = "solid" | "flat" | "faded" | "shadow" | "bordered";
export type BadgeColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeRadius = "none" | "sm" | "md" | "lg" | "full";
export type BadgePlacement =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  radius?: BadgeRadius;
  className?: string;
  content?: React.ReactNode;
  showOutline?: boolean;
  isOneChar?: boolean;
  isDot?: boolean;
  placement?: BadgePlacement;
  isInvisible?: boolean;
  disableAnimation?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "solid",
  color = "default",
  size = "md",
  radius = "md",
  className = "",
  content,
  showOutline = false,
  isOneChar = false,
  isDot = false,
  placement = "top-right",
  isInvisible = false,
  disableAnimation = false,
}) => {
  const sizeClasses = {
    sm: isDot
      ? "w-2 h-2 min-w-[8px] min-h-[8px]"
      : "h-5 min-w-[20px] px-1 text-xs",
    md: isDot
      ? "w-2.5 h-2.5 min-w-[10px] min-h-[10px]"
      : "h-6 min-w-[24px] px-1.5 text-sm",
    lg: isDot
      ? "w-3 h-3 min-w-[12px] min-h-[12px]"
      : "h-7 min-w-[28px] px-2 text-sm",
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
      solid: "bg-gray-600 text-white",
      flat: "bg-gray-100 text-gray-700",
      faded: "bg-gray-50 text-gray-600 border border-gray-200",
      shadow: "bg-gray-600 text-white shadow-lg shadow-gray-500/25",
      bordered: "bg-transparent text-gray-600 border-2 border-gray-300",
    },
    primary: {
      solid: "bg-primary text-white",
      flat: "bg-primary/10 text-primary",
      faded: "bg-primary/5 text-primary border border-primary/20",
      shadow: "bg-primary text-white shadow-lg shadow-primary/25",
      bordered: "bg-transparent text-primary border-2 border-primary",
    },
    secondary: {
      solid: "bg-purple-600 text-white",
      flat: "bg-purple-100 text-purple-700",
      faded: "bg-purple-50 text-purple-600 border border-purple-200",
      shadow: "bg-purple-600 text-white shadow-lg shadow-purple-500/25",
      bordered: "bg-transparent text-purple-600 border-2 border-purple-300",
    },
    success: {
      solid: "bg-green-600 text-white",
      flat: "bg-green-100 text-green-700",
      faded: "bg-green-50 text-green-600 border border-green-200",
      shadow: "bg-green-600 text-white shadow-lg shadow-green-500/25",
      bordered: "bg-transparent text-green-600 border-2 border-green-300",
    },
    warning: {
      solid: "bg-yellow-500 text-black",
      flat: "bg-yellow-100 text-yellow-700",
      faded: "bg-yellow-50 text-yellow-600 border border-yellow-200",
      shadow: "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25",
      bordered: "bg-transparent text-yellow-600 border-2 border-yellow-300",
    },
    danger: {
      solid: "bg-red-600 text-white",
      flat: "bg-red-100 text-red-700",
      faded: "bg-red-50 text-red-600 border border-red-200",
      shadow: "bg-red-600 text-white shadow-lg shadow-red-500/25",
      bordered: "bg-transparent text-red-600 border-2 border-red-300",
    },
  };

  const placementClasses = {
    "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
    "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
    "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3",
    "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
  };

  const baseClasses = isDot
    ? `inline-block ${radiusClasses.full}`
    : `inline-flex items-center justify-center font-medium ${radiusClasses[radius]}`;

  const animationClasses = !disableAnimation
    ? "transition-transform duration-200 hover:scale-105"
    : "";

  const outlineClasses = showOutline ? "ring-2 ring-white ring-offset-2" : "";

  const badgeContent = content !== undefined ? content : children;

  // If badge is used as wrapper (with children)
  if (children && content !== undefined) {
    return (
      <div className="relative inline-flex z-10">
        {children}
        {!isInvisible && (
          <span
            className={`
              absolute
              ${baseClasses}
              ${sizeClasses[size]}
              ${colorClasses[color][variant]}
              ${placementClasses[placement]}
              ${animationClasses}
              ${outlineClasses}
              ${className}
              z-10
            `
              .replace(/\s+/g, " ")
              .trim()}
          >
            {!isDot && badgeContent}
          </span>
        )}
      </div>
    );
  }

  // Standalone badge
  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${colorClasses[color][variant]}
        ${animationClasses}
        ${outlineClasses}
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {!isDot && badgeContent}
    </span>
  );
};

export default Badge;
