import React, { useState, useRef, useEffect, useId } from "react";

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
      return exitDuration || 200;
    }

    if (animationDuration) {
      return animationDuration;
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
        flat: "bg-secondary/10 text-secondary border border-secondary/20",
        shadow: "bg-white text-secondary border-secondary/20 shadow-lg",
      },
      success: {
        solid: "bg-green-600 text-white border-green-700",
        bordered: "bg-transparent text-green-600 border-green-600 border-2",
        light: "bg-green-100 text-green-600 border-green-200",
        flat: "bg-green-100 text-green-600 border border-green-200",
        shadow:
          "bg-white text-green-600 border-green-200 shadow-lg shadow-green-500/25",
      },
      warning: {
        solid: "bg-yellow-600 text-white border-yellow-700",
        bordered: "bg-transparent text-yellow-600 border-yellow-600 border-2",
        light: "bg-yellow-100 text-yellow-600 border-yellow-200",
        flat: "bg-yellow-100 text-yellow-600 border border-yellow-200",
        shadow:
          "bg-white text-yellow-600 border-yellow-200 shadow-lg shadow-yellow-500/25",
      },
      danger: {
        solid: "bg-red-600 text-white border-red-700",
        bordered: "bg-transparent text-red-600 border-red-600 border-2",
        light: "bg-red-100 text-red-600 border-red-200",
        flat: "bg-red-100 text-red-600 border border-red-200",
        shadow:
          "bg-white text-red-600 border-red-200 shadow-lg shadow-red-500/25",
      },
      info: {
        solid: "bg-cyan-600 text-white border-cyan-700",
        bordered: "bg-transparent text-cyan-600 border-cyan-600 border-2",
        light: "bg-cyan-100 text-cyan-600 border-cyan-200",
        flat: "bg-cyan-100 text-cyan-600 border border-cyan-200",
        shadow:
          "bg-white text-cyan-600 border-cyan-200 shadow-lg shadow-cyan-500/25",
      },
    };

    return colorMap[color][variant];
  };

  const getArrowBg = () => {
    const bgMap = {
      default: {
        solid: "bg-gray-800",
        bordered: "bg-white",
        light: "bg-gray-100",
        flat: "bg-gray-200",
        shadow: "bg-white",
      },
      primary: {
        solid: "bg-primary",
        bordered: "bg-white",
        light: "bg-primary/10",
        flat: "bg-primary/20",
        shadow: "bg-white",
      },
      secondary: {
        solid: "bg-secondary",
        bordered: "bg-white",
        light: "bg-secondary/10",
        flat: "bg-secondary/20",
        shadow: "bg-white",
      },
      success: {
        solid: "bg-green-600",
        bordered: "bg-white",
        light: "bg-green-100",
        flat: "bg-green-200",
        shadow: "bg-white",
      },
      warning: {
        solid: "bg-yellow-600",
        bordered: "bg-white",
        light: "bg-yellow-100",
        flat: "bg-yellow-200",
        shadow: "bg-white",
      },
      danger: {
        solid: "bg-red-600",
        bordered: "bg-white",
        light: "bg-red-100",
        flat: "bg-red-200",
        shadow: "bg-white",
      },
      info: {
        solid: "bg-cyan-600",
        bordered: "bg-white",
        light: "bg-cyan-100",
        flat: "bg-cyan-200",
        shadow: "bg-white",
      },
    };

    return bgMap[color]?.[variant] || "bg-gray-800";
  };

  // Add this function after getArrowBg()
  const getArrowBorderColor = () => {
    // Match the exact background colors from getColorClasses()
    const borderColorMap = {
      default: {
        solid: "border-gray-800", // matches bg-gray-800
        bordered: "border-gray-300", // matches border color
        light: "border-gray-100", // matches bg-gray-100
        flat: "border-gray-200", // matches bg-gray-200
        shadow: "border-gray-800", // matches bg-white
      },
      primary: {
        solid: "border-primary", // matches bg-primary
        bordered: "border-primary", // matches border color
        light: "border-primary", // matches bg-primary/10
        flat: "border-primary", // matches bg-primary/20
        shadow: "border-primary", // matches bg-white
      },
      secondary: {
        solid: "border-secondary/100", // matches bg-secondary
        bordered: "border-secondary/100", // matches border color
        light: "border-secondary", // matches bg-secondary/10
        flat: "border-secondary", // matches bg-secondary/20
        shadow: "border-secondary", // matches bg-white
      },
      success: {
        solid: "border-green-600", // matches bg-green-600
        bordered: "border-green-600", // matches border color
        light: "border-green-100", // matches bg-green-100
        flat: "border-green-200", // matches bg-green-200
        shadow: "border-green-600", // matches bg-white
      },
      warning: {
        solid: "border-yellow-600", // matches bg-yellow-600
        bordered: "border-yellow-600", // matches border color
        light: "border-yellow-100", // matches bg-yellow-100
        flat: "border-yellow-200", // matches bg-yellow-200
        shadow: "border-yellow-600", // matches bg-white
      },
      danger: {
        solid: "border-red-600", // matches bg-red-600
        bordered: "border-red-600", // matches border color
        light: "border-red-100", // matches bg-red-100
        flat: "border-red-200", // matches bg-red-200
        shadow: "border-red-600", // matches bg-white
      },
      info: {
        solid: "border-cyan-600", // matches bg-cyan-600
        bordered: "border-cyan-600", // matches border color
        light: "border-cyan-100", // matches bg-cyan-100
        flat: "border-cyan-200", // matches bg-cyan-200
        shadow: "border-cyan-600", // matches bg-white
      },
    };

    return borderColorMap[color][variant] || "border-gray-800";
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

  const renderArrow = () => {
    if (!showArrow) return null;

    // Size mapping for triangle borders
    const sizeMap = {
      sm: "4", // 4px triangle
      md: "6", // 6px triangle
      lg: "8", // 8px triangle
    };

    const triangleSize = sizeMap[size];

    // Get arrow color that matches tooltip exactly
    const getArrowTriangleColor = () => {
      const colorMap = {
        default: {
          solid: "gray-800",
          bordered: "gray-300",
          light: "gray-100",
          flat: "gray-100",
          shadow: "white",
        },
        primary: {
          solid: "primary",
          bordered: "primary",
          light: "primary/10",
          flat: "primary/10",
          shadow: "white",
        },
        secondary: {
          solid: "secondary",
          bordered: "secondary",
          light: "secondary/10",
          flat: "secondary/10",
          shadow: "white",
        },
        success: {
          solid: "green-600",
          bordered: "green-600",
          light: "green-100",
          flat: "green-100",
          shadow: "white",
        },
        warning: {
          solid: "yellow-600",
          bordered: "yellow-600",
          light: "yellow-100",
          flat: "yellow-100",
          shadow: "white",
        },
        danger: {
          solid: "red-600",
          bordered: "red-600",
          light: "red-100",
          flat: "red-100",
          shadow: "white",
        },
        info: {
          solid: "cyan-600",
          bordered: "cyan-600",
          light: "cyan-100",
          flat: "cyan-100",
          shadow: "white",
        },
      };

      return colorMap[color][variant];
    };

    const arrowColor = getArrowTriangleColor();

    // Enhanced shadow for better visibility
    const getShadowClass = () => {
      if (variant === "shadow") {
        const shadowMap = {
          primary: "drop-shadow-[0_4px_6px_rgba(59,130,246,0.25)]",
          secondary: "drop-shadow-lg",
          success: "drop-shadow-[0_4px_6px_rgba(34,197,94,0.25)]",
          warning: "drop-shadow-[0_4px_6px_rgba(234,179,8,0.25)]",
          danger: "drop-shadow-[0_4px_6px_rgba(239,68,68,0.25)]",
          info: "drop-shadow-[0_4px_6px_rgba(6,182,212,0.25)]",
          default: "drop-shadow-lg",
        };
        return shadowMap[color] || "drop-shadow-lg";
      }

      if (variant === "light" || variant === "flat") {
        return "drop-shadow-sm"; // Subtle shadow for visibility
      }

      return "";
    };

    const shadowClass = getShadowClass();

    // CSS Triangle approach - much cleaner
    const getTriangleClasses = () => {
      const baseClasses = `absolute w-0 h-0 z-20 rotate-90 text-primary ${shadowClass}`;

      switch (actualPlacement) {
        case "top":
          return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-[${triangleSize}px] border-r-[${triangleSize}px] border-b-[${triangleSize}px] border-l-transparent border-r-transparent border-b-${arrowColor}`;
        case "bottom":
          return `${baseClasses} top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-[${triangleSize}px] border-r-[${triangleSize}px] border-t-[${triangleSize}px] border-l-transparent border-r-transparent border-t-${arrowColor}`;
        case "left":
          return `${baseClasses} right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-[${triangleSize}px] border-b-[${triangleSize}px] border-r-[${triangleSize}px] border-t-transparent border-b-transparent border-r-${arrowColor}`;
        case "right":
          return `${baseClasses} left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-[${triangleSize}px] border-b-[${triangleSize}px] border-l-[${triangleSize}px] border-t-transparent border-b-transparent border-l-${arrowColor}`;
        default:
          return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-[${triangleSize}px] border-r-[${triangleSize}px] border-b-[${triangleSize}px] border-l-transparent border-r-transparent border-b-${arrowColor}`;
      }
    };

    return <div className={getTriangleClasses()} aria-hidden="true" />;
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
      <span className="inline-block">{children}</span>

      {visible && (
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
