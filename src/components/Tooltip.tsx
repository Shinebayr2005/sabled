import React, { useState, useRef, useEffect } from "react";

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
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "enter" | "exit" | "idle"
  >("idle");
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  const getAnimationDuration = (phase: "enter" | "exit") => {
    if (phase === "exit") {
      return 200; // All exit animations are 200ms
    }

    // Enter animation durations vary by type
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
        flat: "bg-gray-200 text-gray-800 border-transparent",
        shadow: "bg-white text-gray-800 border-gray-200 shadow-lg",
      },
      primary: {
        solid: "bg-primary text-white border-primary",
        bordered: "bg-transparent text-primary border-primary border-2",
        light: "bg-primary/10 text-primary border-primary/20",
        flat: "bg-primary/20 text-primary border-transparent",
        shadow: "bg-white text-primary border-primary/20 shadow-lg shadow-primary/25",
      },
      secondary: {
        solid: "bg-gray-600 text-white border-gray-700",
        bordered: "bg-transparent text-gray-600 border-gray-600 border-2",
        light: "bg-gray-100 text-gray-600 border-gray-200",
        flat: "bg-gray-200 text-gray-600 border-transparent",
        shadow: "bg-white text-gray-600 border-gray-200 shadow-lg",
      },
      success: {
        solid: "bg-green-600 text-white border-green-700",
        bordered: "bg-transparent text-green-600 border-green-600 border-2",
        light: "bg-green-100 text-green-600 border-green-200",
        flat: "bg-green-200 text-green-600 border-transparent",
        shadow: "bg-white text-green-600 border-green-200 shadow-lg shadow-green-500/25",
      },
      warning: {
        solid: "bg-yellow-600 text-white border-yellow-700",
        bordered: "bg-transparent text-yellow-600 border-yellow-600 border-2",
        light: "bg-yellow-100 text-yellow-600 border-yellow-200",
        flat: "bg-yellow-200 text-yellow-600 border-transparent",
        shadow: "bg-white text-yellow-600 border-yellow-200 shadow-lg shadow-yellow-500/25",
      },
      danger: {
        solid: "bg-red-600 text-white border-red-700",
        bordered: "bg-transparent text-red-600 border-red-600 border-2",
        light: "bg-red-100 text-red-600 border-red-200",
        flat: "bg-red-200 text-red-600 border-transparent",
        shadow: "bg-white text-red-600 border-red-200 shadow-lg shadow-red-500/25",
      },
      info: {
        solid: "bg-cyan-600 text-white border-cyan-700",
        bordered: "bg-transparent text-cyan-600 border-cyan-600 border-2",
        light: "bg-cyan-100 text-cyan-600 border-cyan-200",
        flat: "bg-cyan-200 text-cyan-600 border-transparent",
        shadow: "bg-white text-cyan-600 border-cyan-200 shadow-lg shadow-cyan-500/25",
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

  const getArrowColor = () => {
    const arrowColorMap = {
      default: {
        solid: "border-t-gray-800",
        bordered: "border-t-gray-300",
        light: "border-t-gray-100",
        flat: "border-t-gray-200",
        shadow: "border-t-white",
      },
      primary: {
        solid: "border-t-primary",
        bordered: "border-t-primary",
        light: "border-t-primary/10",
        flat: "border-t-primary/20",
        shadow: "border-t-white",
      },
      secondary: {
        solid: "border-t-gray-600",
        bordered: "border-t-gray-600",
        light: "border-t-gray-100",
        flat: "border-t-gray-200",
        shadow: "border-t-white",
      },
      success: {
        solid: "border-t-green-600",
        bordered: "border-t-green-600",
        light: "border-t-green-100",
        flat: "border-t-green-200",
        shadow: "border-t-white",
      },
      warning: {
        solid: "border-t-yellow-600",
        bordered: "border-t-yellow-600",
        light: "border-t-yellow-100",
        flat: "border-t-yellow-200",
        shadow: "border-t-white",
      },
      danger: {
        solid: "border-t-red-600",
        bordered: "border-t-red-600",
        light: "border-t-red-100",
        flat: "border-t-red-200",
        shadow: "border-t-white",
      },
      info: {
        solid: "border-t-cyan-600",
        bordered: "border-t-cyan-600",
        light: "border-t-cyan-100",
        flat: "border-t-cyan-200",
        shadow: "border-t-white",
      },
    };

    return arrowColorMap[color][variant];
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-8";
    const colorClass = getArrowColor();

    switch (placement) {
      case "top":
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 ${colorClass} border-x-transparent border-b-transparent`;
      case "bottom":
        return `${baseClasses} top-0 left-1/2 -translate-x-1/2 ${colorClass.replace(
          "border-t-",
          "border-b-"
        )} border-x-transparent border-t-transparent`;
      case "left":
        return `${baseClasses} right-0 top-1/2 -translate-y-1/2 ${colorClass.replace(
          "border-t-",
          "border-l-"
        )} border-y-transparent border-r-transparent`;
      case "right":
        return `${baseClasses} left-0 top-1/2 -translate-y-1/2 ${colorClass.replace(
          "border-t-",
          "border-r-"
        )} border-y-transparent border-l-transparent`;
      default:
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 ${colorClass} border-x-transparent border-b-transparent`;
    }
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
          return placement === "top"
            ? "tooltip-slide-up"
            : placement === "bottom"
            ? "tooltip-slide-down"
            : placement === "left"
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
    switch (placement) {
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

  return (
    <span
      className="relative inline-block max-w-max"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span className="inline-block ">{children}</span>

      {visible && (
        <div
          className={`
            absolute z-50 pointer-events-none
            min-w-max
            ${positionClasses[placement]} 
            ${getAnimationClasses()}
            ${getTransformOrigin()}
            ${className}
          `}
          style={{ maxWidth: maxWidth }}
        >
          <div className="relative">
            {showArrow && <div className={getArrowClasses()} />}
            <div
              className={`
                rounded-lg backdrop-blur-sm border break-words
                ${getColorClasses()}
                ${getSizeClasses()}
              `}
            >
              {content}
            </div>
          </div>
        </div>
      )}
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
