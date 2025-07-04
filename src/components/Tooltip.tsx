import React, { useState, useRef, useEffect } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipAnimation = "scale" | "fade" | "slide" | "bounce";
type TooltipVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
type TooltipSize = "sm" | "md" | "lg";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  delay?: number;
  closeDelay?: number;
  animation?: TooltipAnimation;
  variant?: TooltipVariant;
  size?: TooltipSize;
  className?: string;
  isDisabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  delay = 500,
  closeDelay = 100,
  animation = "scale",
  variant = "default",
  size = "md",
  className = "",
  isDisabled = false,
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
      // Exit animation durations - now consistent
      return animation === "fade" ? 200 : 200; // All exit animations are 200ms
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

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white border-blue-700";
      case "secondary":
        return "bg-gray-600 text-white border-gray-700";
      case "success":
        return "bg-green-600 text-white border-green-700";
      case "warning":
        return "bg-yellow-600 text-white border-yellow-700";
      case "danger":
        return "bg-red-600 text-white border-red-700";
      case "info":
        return "bg-cyan-600 text-white border-cyan-700";
      case "default":
      default:
        return "bg-gray-800 text-white border-gray-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1 max-w-48";
      case "lg":
        return "text-base px-4 py-3 max-w-80";
      case "md":
      default:
        return "text-sm px-3 py-2 max-w-xs";
    }
  };

  const getArrowColor = () => {
    switch (variant) {
      case "primary":
        return "border-t-blue-600";
      case "secondary":
        return "border-t-gray-600";
      case "success":
        return "border-t-green-600";
      case "warning":
        return "border-t-yellow-600";
      case "danger":
        return "border-t-red-600";
      case "info":
        return "border-t-cyan-600";
      case "default":
      default:
        return "border-t-gray-800";
    }
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-8";
    const colorClass = getArrowColor();
    
    switch (placement) {
      case "top":
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 ${colorClass} border-x-transparent border-b-transparent`;
      case "bottom":
        return `${baseClasses} top-0 left-1/2 -translate-x-1/2 ${colorClass.replace('border-t-', 'border-b-')} border-x-transparent border-t-transparent`;
      case "left":
        return `${baseClasses} right-0 top-1/2 -translate-y-1/2 ${colorClass.replace('border-t-', 'border-l-')} border-y-transparent border-r-transparent`;
      case "right":
        return `${baseClasses} left-0 top-1/2 -translate-y-1/2 ${colorClass.replace('border-t-', 'border-r-')} border-y-transparent border-l-transparent`;
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
            max-w-52 min-w-max
            ${positionClasses[placement]} 
            ${getAnimationClasses()}
            ${getTransformOrigin()}
            ${className}
          `}
        >
          <div className="relative">
            {showArrow && (
              <div className={getArrowClasses()} />
            )}
            <div
              className={`
                rounded-lg shadow-lg backdrop-blur-sm border break-words
                ${getVariantClasses()}
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
  TooltipVariant,
  TooltipSize,
  TooltipProps as TooltipNewProps,
  TooltipPlacement as TooltipNewPlacement,
  TooltipAnimation as TooltipNewAnimation,
};

// Set display name for debugging
Tooltip.displayName = "Tooltip";

export default Tooltip;
