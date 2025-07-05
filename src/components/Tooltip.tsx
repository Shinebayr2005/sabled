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
        shadow:
          "bg-white text-primary border-primary/20 shadow-lg shadow-primary/25",
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
        shadow:
          "bg-white text-green-600 border-green-200 shadow-lg shadow-green-500/25",
      },
      warning: {
        solid: "bg-yellow-600 text-white border-yellow-700",
        bordered: "bg-transparent text-yellow-600 border-yellow-600 border-2",
        light: "bg-yellow-100 text-yellow-600 border-yellow-200",
        flat: "bg-yellow-200 text-yellow-600 border-transparent",
        shadow:
          "bg-white text-yellow-600 border-yellow-200 shadow-lg shadow-yellow-500/25",
      },
      danger: {
        solid: "bg-red-600 text-white border-red-700",
        bordered: "bg-transparent text-red-600 border-red-600 border-2",
        light: "bg-red-100 text-red-600 border-red-200",
        flat: "bg-red-200 text-red-600 border-transparent",
        shadow:
          "bg-white text-red-600 border-red-200 shadow-lg shadow-red-500/25",
      },
      info: {
        solid: "bg-cyan-600 text-white border-cyan-700",
        bordered: "bg-transparent text-cyan-600 border-cyan-600 border-2",
        light: "bg-cyan-100 text-cyan-600 border-cyan-200",
        flat: "bg-cyan-200 text-cyan-600 border-transparent",
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

  const getArrowColor = () => {
    // Match the exact background colors from getColorClasses()
    const arrowColorMap = {
      default: {
        solid: "border-t-gray-800", // matches bg-gray-800
        bordered: "border-t-gray-300", // matches the border color
        light: "border-t-gray-100", // matches bg-gray-100
        flat: "border-t-gray-200", // matches bg-gray-200
        shadow: "border-t-white", // matches bg-white
      },
      primary: {
        solid: "border-t-primary", // matches bg-primary
        bordered: "border-t-primary", // matches the border color
        light: "border-t-primary/10", // matches bg-primary/10
        flat: "border-t-primary/20", // matches bg-primary/20
        shadow: "border-t-white", // matches bg-white
      },
      secondary: {
        solid: "border-t-gray-600", // matches bg-gray-600
        bordered: "border-t-gray-600", // matches the border color
        light: "border-t-gray-100", // matches bg-gray-100
        flat: "border-t-gray-200", // matches bg-gray-200
        shadow: "border-t-white", // matches bg-white
      },
      success: {
        solid: "border-t-green-600", // matches bg-green-600
        bordered: "border-t-green-600", // matches the border color
        light: "border-t-green-100", // matches bg-green-100
        flat: "border-t-green-200", // matches bg-green-200
        shadow: "border-t-white", // matches bg-white
      },
      warning: {
        solid: "border-t-yellow-600", // matches bg-yellow-600
        bordered: "border-t-yellow-600", // matches the border color
        light: "border-t-yellow-100", // matches bg-yellow-100
        flat: "border-t-yellow-200", // matches bg-yellow-200
        shadow: "border-t-white", // matches bg-white
      },
      danger: {
        solid: "border-t-red-600", // matches bg-red-600
        bordered: "border-t-red-600", // matches the border color
        light: "border-t-red-100", // matches bg-red-100
        flat: "border-t-red-200", // matches bg-red-200
        shadow: "border-t-white", // matches bg-white
      },
      info: {
        solid: "border-t-cyan-600", // matches bg-cyan-600
        bordered: "border-t-cyan-600", // matches the border color
        light: "border-t-cyan-100", // matches bg-cyan-100
        flat: "border-t-cyan-200", // matches bg-cyan-200
        shadow: "border-t-white", // matches bg-white
      },
    };

    return arrowColorMap[color][variant];
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-0 h-0 border-8 z-20";
    const colorClass = getArrowColor();
    
    // Match tooltip's exact styling for each variant
    let arrowStyleClasses = "";
    
    switch (variant) {
      case "solid":
        arrowStyleClasses = "backdrop-blur-sm";
        break;
      case "bordered":
        arrowStyleClasses = "backdrop-blur-sm";
        break;
      case "light":
        arrowStyleClasses = "backdrop-blur-sm";
        break;
      case "flat":
        arrowStyleClasses = "backdrop-blur-sm";
        break;
      case "shadow":
        // Shadow variant needs drop-shadow to match tooltip
        const shadowClass = color === "primary" ? "drop-shadow-[0_4px_12px_rgba(var(--color-primary-rgb,59,130,246),0.25)]" :
                          color === "success" ? "drop-shadow-[0_4px_12px_rgba(34,197,94,0.25)]" :
                          color === "warning" ? "drop-shadow-[0_4px_12px_rgba(234,179,8,0.25)]" :
                          color === "danger" ? "drop-shadow-[0_4px_12px_rgba(239,68,68,0.25)]" :
                          color === "info" ? "drop-shadow-[0_4px_12px_rgba(6,182,212,0.25)]" :
                          "drop-shadow-lg";
        arrowStyleClasses = `backdrop-blur-sm ${shadowClass}`;
        break;
      default:
        arrowStyleClasses = "backdrop-blur-sm";
    }

    switch (placement) {
      case "top":
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${colorClass} border-x-transparent border-b-transparent ${arrowStyleClasses}`;
      case "bottom":
        return `${baseClasses} top-0 left-1/2 -translate-x-1/2 -translate-y-full ${colorClass.replace("border-t-", "border-b-")} border-x-transparent border-t-transparent ${arrowStyleClasses}`;
      case "left":
        return `${baseClasses} right-0 top-1/2 -translate-y-1/2 translate-x-full ${colorClass.replace("border-t-", "border-l-")} border-y-transparent border-r-transparent ${arrowStyleClasses}`;
      case "right":
        return `${baseClasses} left-0 top-1/2 -translate-y-1/2 -translate-x-full ${colorClass.replace("border-t-", "border-r-")} border-y-transparent border-l-transparent ${arrowStyleClasses}`;
      default:
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${colorClass} border-x-transparent border-b-transparent ${arrowStyleClasses}`;
    }
  };

  const renderArrow = () => {
    if (!showArrow) return null;

    // For bordered variant, we need to create a layered arrow effect
    if (variant === "bordered") {
      const getBorderArrowClasses = () => {
        const borderSize = "border-[9px]"; // Slightly larger for border effect
        const borderColorClass = getArrowColor();
        const baseBorderClasses = `absolute w-0 h-0 ${borderSize} z-10`;
        
        switch (placement) {
          case "top":
            return `${baseBorderClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${borderColorClass} border-x-transparent border-b-transparent`;
          case "bottom":
            return `${baseBorderClasses} top-0 left-1/2 -translate-x-1/2 -translate-y-full ${borderColorClass.replace("border-t-", "border-b-")} border-x-transparent border-t-transparent`;
          case "left":
            return `${baseBorderClasses} right-0 top-1/2 -translate-y-1/2 translate-x-full ${borderColorClass.replace("border-t-", "border-l-")} border-y-transparent border-r-transparent`;
          case "right":
            return `${baseBorderClasses} left-0 top-1/2 -translate-y-1/2 -translate-x-full ${borderColorClass.replace("border-t-", "border-r-")} border-y-transparent border-l-transparent`;
          default:
            return `${baseBorderClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${borderColorClass} border-x-transparent border-b-transparent`;
        }
      };

      const getBackgroundArrowClasses = () => {
        const bgSize = "border-[7px]"; // Smaller for background
        const bgColorClass = "border-t-transparent"; // Transparent background for bordered
        const baseBgClasses = `absolute w-0 h-0 ${bgSize} z-20`;
        
        switch (placement) {
          case "top":
            return `${baseBgClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${bgColorClass} border-x-transparent border-b-transparent backdrop-blur-sm`;
          case "bottom":
            return `${baseBgClasses} top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-transparent border-x-transparent border-t-transparent backdrop-blur-sm`;
          case "left":
            return `${baseBgClasses} right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-transparent border-y-transparent border-r-transparent backdrop-blur-sm`;
          case "right":
            return `${baseBgClasses} left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-transparent border-y-transparent border-l-transparent backdrop-blur-sm`;
          default:
            return `${baseBgClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full ${bgColorClass} border-x-transparent border-b-transparent backdrop-blur-sm`;
        }
      };

      return (
        <>
          {/* Border arrow (larger, behind) */}
          <div className={getBorderArrowClasses()} />
          {/* Background arrow (smaller, in front) */}
          <div className={getBackgroundArrowClasses()} />
        </>
      );
    }

    // For non-bordered variants, use simple arrow
    return <div className={getArrowClasses()} />;
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
          <div className="relative z-10">
            {renderArrow()}
            <div
              className={`
                rounded-lg backdrop-blur-sm border break-words relative z-10
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
