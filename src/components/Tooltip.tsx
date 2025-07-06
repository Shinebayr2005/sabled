import React, { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipAnimation = "scale" | "fade" | "slide" | "bounce";
type TooltipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type TooltipVariant = "solid" | "bordered" | "light" | "flat" | "shadow";
type TooltipSize = "sm" | "md" | "lg";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  delay?: number;
  closeDelay?: number;
  animation?: TooltipAnimation;
  color?: TooltipColor;
  variant?: TooltipVariant;
  size?: TooltipSize;
  className?: string;
  isDisabled?: boolean;
  maxWidth?: string;
  animationDuration?: number;
  exitDuration?: number;
  usePortal?: boolean;
  disableAutoPosition?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  delay = 500,
  closeDelay = 100,
  animation = "scale",
  color = "default",
  variant = "solid",
  size = "md",
  className = "",
  isDisabled = false,
  maxWidth = "210px",
  animationDuration,
  exitDuration,
  usePortal = false,
  disableAutoPosition = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "enter" | "exit" | "idle"
  >("idle");
  const [actualPlacement, setActualPlacement] =
    useState<TooltipPlacement>(placement);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const getAnimationDuration = (phase: "enter" | "exit") => {
    if (phase === "exit") {
      return exitDuration || 200; // Custom exit duration or default 200ms
    }

    if (animationDuration) {
      return animationDuration; // Use custom duration if provided
    }

    // Default enter animation durations vary by type
    switch (animation) {
      case "fade":
        return 150;
      case "scale":
      case "slide":
        return 200;
      case "bounce":
        return 300;
      default:
        return 200;
    }
  };

  const getColorClasses = () => {
    const colorMap = {
      default: {
        solid: "bg-gray-800 text-white border-gray-700",
        bordered: "bg-transparent text-gray-800 border-gray-300 border-2",
        light: "bg-gray-100 text-gray-800 border-gray-200",
        flat: "bg-gray-100 text-gray-800 border border-gray-200",
        shadow: "bg-white text-gray-800 border-gray-200 shadow-lg",
      },
      primary: {
        solid: "bg-primary text-white border-primary",
        bordered: "bg-transparent text-primary border-primary border-2",
        light: "bg-primary/10 text-primary border-primary/20",
        flat: "bg-primary/10 text-primary border border-primary/20",
        shadow:
          "bg-white text-primary border-primary/20 shadow-lg shadow-primary/25",
      },
      secondary: {
        solid: "bg-secondary text-white border-secondary",
        bordered: "bg-transparent text-secondary border-secondary border-2",
        light: "bg-secondary/10 text-secondary border-secondary/20",
        flat: "bg-gray-100 text-gray-800 border border-gray-200",
        shadow: "bg-white text-secondary border-secondary/20 shadow-lg",
      },
      success: {
        solid: "bg-green-600 text-white border-green-700",
        bordered: "bg-transparent text-green-600 border-green-600 border-2",
        light: "bg-green-100 text-green-600 border-green-200",
        flat: "bg-green-100 text-green-800 border border-green-200",
        shadow:
          "bg-white text-green-600 border-green-200 shadow-lg shadow-green-500/25",
      },
      warning: {
        solid: "bg-yellow-600 text-white border-yellow-700",
        bordered: "bg-transparent text-yellow-600 border-yellow-600 border-2",
        light: "bg-yellow-100 text-yellow-600 border-yellow-200",
        flat: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        shadow:
          "bg-white text-yellow-600 border-yellow-200 shadow-lg shadow-yellow-500/25",
      },
      danger: {
        solid: "bg-red-600 text-white border-red-700",
        bordered: "bg-transparent text-red-600 border-red-600 border-2",
        light: "bg-red-100 text-red-600 border-red-200",
        flat: "bg-red-100 text-red-800 border border-red-200",
        shadow:
          "bg-white text-red-600 border-red-200 shadow-lg shadow-red-500/25",
      },
      info: {
        solid: "bg-cyan-600 text-white border-cyan-700",
        bordered: "bg-transparent text-cyan-600 border-cyan-600 border-2",
        light: "bg-cyan-100 text-cyan-600 border-cyan-200",
        flat: "bg-cyan-100 text-cyan-800 border border-cyan-200",
        shadow:
          "bg-white text-cyan-600 border-cyan-200 shadow-lg shadow-cyan-500/25",
      },
    };

    return colorMap[color][variant];
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "lg":
        return "text-base px-4 py-3";
      case "md":
      default:
        return "text-sm px-3 py-2";
    }
  };

  const getArrowTriangleColor = () => {
    // Use Tailwind v4 CSS theme custom properties for dynamic colors
    const colorMap = {
      primary: {
        solid: "var(--color-primary, #463cd7)",
        bordered: "var(--color-primary, #3c46d7)",
        light: "var(--color-primary-100, #dfdcfc)",
        flat: "var(--color-primary-100, #dcdcfc)",
        shadow: "#ffffff",
      },
      secondary: {
        solid: "var(--color-secondary, #4b5563)",
        bordered: "var(--color-secondary, #4b5563)",
        light: "var(--color-secondary-100, #f3f4f6)",
        flat: "var(--color-secondary-100, #f3f4f6)",
        shadow: "#ffffff",
      },
      success: {
        solid: "var(--color-success, #16a34a)", // green-600
        bordered: "var(--color-success, #16a34a)", // green-600
        light: "var(--color-success-100, #dcfce7)", // green-100
        flat: "var(--color-success-100, #dcfce7)", // green-100
        shadow: "#ffffff",
      },
      warning: {
        solid: "var(--color-warning, #ca8a04)", // yellow-600
        bordered: "var(--color-warning, #ca8a04)", // yellow-600
        light: "var(--color-warning-100, #fef3c7)", // yellow-100
        flat: "var(--color-warning-100, #fef3c7)", // yellow-100
        shadow: "#ffffff",
      },
      danger: {
        solid: "var(--color-danger, #dc2626)", // red-600
        bordered: "var(--color-danger, #dc2626)", // red-600
        light: "var(--color-danger-100, #fee2e2)", // red-100
        flat: "var(--color-danger-100, #fee2e2)", // red-100
        shadow: "#ffffff",
      },
      info: {
        solid: "var(--color-info, #06b6d4)", // cyan-600
        bordered: "var(--color-info, #06b6d4)", // cyan-600
        light: "var(--color-info-100, #cffafe)", // cyan-100
        flat: "var(--color-info-100, #cffafe)", // cyan-100
        shadow: "#ffffff",
      },
      default: {
        solid: "var(--color-gray-800, #1f2937)", // gray-800
        bordered: "var(--color-gray-300, #d1d5db)", // gray-300
        light: "var(--color-gray-100, #f3f4f6)", // gray-100
        flat: "var(--color-gray-100, #f3f4f6)", // gray-100
        shadow: "#ffffff",
      },
    };

    const arrowColor = colorMap[color]?.[variant] || colorMap.default.solid;

    // Map placement to the correct border side for triangle
    const borderSideMap = {
      top: "borderBottomColor",
      bottom: "borderTopColor",
      left: "borderRightColor",
      right: "borderLeftColor",
    };

    const borderSide = borderSideMap[actualPlacement];

    return {
      [borderSide]: arrowColor,
    };
  };

  const renderArrow = () => {
    if (!showArrow) return null;

    const base = "absolute w-0 h-0 z-20";

    // Use static Tailwind classes instead of dynamic ones
    const arrowSizeClasses = {
      sm: {
        top: "border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent",
        bottom:
          "border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent",
        left: "border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent",
        right:
          "border-t-[5px] border-b-[5px] border-l-[5px] border-t-transparent border-b-transparent",
      },
      md: {
        top: "border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent",
        bottom:
          "border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent",
        left: "border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent",
        right:
          "border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent",
      },
      lg: {
        top: "border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent",
        bottom:
          "border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent",
        left: "border-t-[7px] border-b-[7px] border-r-[7px] border-t-transparent border-b-transparent",
        right:
          "border-t-[7px] border-b-[7px] border-l-[7px] border-t-transparent border-b-transparent",
      },
    };

    const placementMap = {
      top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
      bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full",
      left: "right-0 top-1/2 -translate-y-1/2 translate-x-full",
      right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full",
    };

    const triangleClass = arrowSizeClasses[size][actualPlacement];
    const positionClass = placementMap[actualPlacement];
    const colorStyle = getArrowTriangleColor();

    // Add shadow for shadow variant
    const shadowClass = variant === "shadow" ? "drop-shadow-md" : "";

    return (
      <div
        className={`${base} ${positionClass} ${triangleClass} ${shadowClass}`}
        aria-hidden="true"
        style={colorStyle}
      />
    );
  };

  const show = () => {
    if (isDisabled) return;

    // Clear any existing timeouts
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (showTimeoutRef.current) return; // Already showing

    showTimeoutRef.current = setTimeout(() => {
      setVisible(true);
      setIsAnimating(true);
      setAnimationPhase("enter");

      // Remove animation class after animation completes
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimationPhase("idle");
      }, getAnimationDuration("enter"));
    }, delay);
  };

  const hide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!visible) return;

    // Start exit animation immediately
    setIsAnimating(true);
    setAnimationPhase("exit");

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setIsAnimating(false);
      setAnimationPhase("idle");
    }, getAnimationDuration("exit"));
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const getAnimationClasses = () => {
    if (!isAnimating) return "";

    const baseAnimation = (() => {
      switch (animation) {
        case "scale":
          return "tooltip-scale";
        case "fade":
          return "tooltip-fade";
        case "slide":
          return actualPlacement === "top"
            ? "tooltip-slide-up"
            : actualPlacement === "bottom"
            ? "tooltip-slide-down"
            : actualPlacement === "left"
            ? "tooltip-slide-left"
            : "tooltip-slide-right";
        case "bounce":
          return "tooltip-bounce";
        default:
          return "tooltip-scale";
      }
    })();

    const phase = animationPhase === "enter" ? "enter" : "exit";
    return `${baseAnimation}-${phase}`;
  };

  const getTransformOrigin = () => {
    switch (actualPlacement) {
      case "top":
        return "tooltip-origin-top";
      case "bottom":
        return "tooltip-origin-bottom";
      case "left":
        return "tooltip-origin-left";
      case "right":
        return "tooltip-origin-right";
      default:
        return "tooltip-origin-top";
    }
  };

  const getBackgroundStyle = () => {
    // For primary colors with light/flat variants, use Tailwind v4 CSS theme custom properties
    if (color === "primary" && (variant === "light" || variant === "flat")) {
      return {
        backgroundColor: "var(--color-primary-100, #dcfce7)",
      };
    }
    return {};
  };

  const renderTooltip = () => {
    if (!visible) return null;

    return (
      <div
        id={tooltipId}
        role="tooltip"
        className={`
          absolute z-50 pointer-events-none
          min-w-max
          ${positionClasses[actualPlacement]} 
          ${getAnimationClasses()}
          ${getTransformOrigin()}
          ${className}
        `}
        style={{
          maxWidth: maxWidth,
          animationDuration: `${getAnimationDuration(
            animationPhase === "idle" ? "enter" : animationPhase
          )}ms`,
        }}
        ref={tooltipRef}
      >
        <div className="relative z-10">
          {renderArrow()}
          <div
            className={`
              rounded-lg border break-words relative z-10
              ${variant === "flat" ? "" : "backdrop-blur-sm"}
              ${getColorClasses()}
              ${getSizeClasses()}
            `}
            style={getBackgroundStyle()}
          >
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <span
      className="relative inline-block max-w-max"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      ref={triggerRef}
      aria-describedby={visible ? tooltipId : undefined}
    >
      <span className="inline-block ">{children}</span>

      {usePortal && typeof document !== "undefined"
        ? createPortal(renderTooltip(), document.body)
        : renderTooltip()}
    </span>
  );
};

// Export types
export type {
  TooltipProps,
  TooltipPlacement,
  TooltipAnimation,
  TooltipColor,
  TooltipVariant,
  TooltipSize,
};

// Set display name for debugging
Tooltip.displayName = "Tooltip";

export default Tooltip;
